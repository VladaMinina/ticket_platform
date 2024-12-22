import {Request, Response, NextFunction} from 'express';
import { Order } from '../models/order';
import { NotAutorizedError, NotFoundError } from '@vm-kvitki/common-lib';

export const showOrderController = async(req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if(!order) {
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id) {
        throw new NotAutorizedError();
    }
    res.send(order);
}