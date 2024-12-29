import { Request, Response, NextFunction} from 'express';
import {Order} from '../models/orders';
import { BadRequestError, NotAutorizedError, NotFoundError, OrderStatus } from '@vm-kvitki/common-lib';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-singleton';

export const newController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            console.log('order not found');
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAutorizedError();
        }

        if(order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Order was cancelled');
        }
        console.log('Calling stripe.charges.create...');

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        });

        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        })
        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: charge.id,
        })

        console.log('Stripe charge created');
        res.status(201).send({ payment });
    } catch(err) {
        console.log(err);
        next(err);
    }
}