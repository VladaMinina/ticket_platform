import {Request, Response, NextFunction} from 'express';
import { Order, OrderStatus } from '../models/order';
import { NotAutorizedError, NotFoundError } from '@vm-kvitki/common-lib';
import { OrderCancelledPublisher } from '../events/order-cancelled-publisher';
import { natsWrapper } from '../nats-singleton';

export const deleteOrderController = async(req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    if(!order) {
        throw new NotFoundError();
    }

    if(req.currentUser!.id !== order.userId) {
        throw new NotAutorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        }    
    });
    res.status(204).send(order);
}