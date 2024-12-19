import {Request, Response, NextFunction} from 'express';

export const showOrderController = (req: Request, res: Response, next: NextFunction) => {
    res.send({});
}