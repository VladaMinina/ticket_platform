import {Request, Response, NextFunction} from 'express';

export const indexOrderController = (req: Request, res: Response, next: NextFunction) => {
    res.send({});
}