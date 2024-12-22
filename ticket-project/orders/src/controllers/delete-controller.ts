import {Request, Response, NextFunction} from 'express';
import { Order, OrderStatus } from '../models/order';
import { NotAutorizedError, NotFoundError } from '@vm-kvitki/common-lib';

export const deleteOrderController = async(req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if(!order) {
        throw new NotFoundError();
    }

    if(req.currentUser!.id !== order.userId) {
        throw new NotAutorizedError();
    }
    order.status = OrderStatus.Cancelled;
    order.save();
    res.status(204).send(order);
}