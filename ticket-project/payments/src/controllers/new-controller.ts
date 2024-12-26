import { Request, Response, NextFunction} from 'express';
import {Order} from '../models/orders';
import { BadRequestError, NotAutorizedError, NotFoundError, OrderStatus } from '@vm-kvitki/common-lib';

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

        console.log('New controller');
        res.send({ success: true });
    } catch(err) {
        next(err);
    }
}