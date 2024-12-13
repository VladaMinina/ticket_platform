import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const currentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send({currentUser: req.currentUser || null});
}

export { currentUser };