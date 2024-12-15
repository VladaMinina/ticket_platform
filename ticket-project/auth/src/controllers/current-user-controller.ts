import { Request, Response, NextFunction } from 'express';

const currentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send({currentUser: req.currentUser || null});
}

export { currentUser };