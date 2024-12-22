import {Request, Response, NextFunction} from 'express';
import {Order} from '../models/order';

export const indexOrderController = async(req: Request, res: Response, next: NextFunction) => {
    const order = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket'); //method populate allows to attach additional info

    res.send(order);
}