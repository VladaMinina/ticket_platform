import { Request, Response } from 'express';

const signout = async (req: Request, res: Response): Promise<void> => {
    req.session = null;

    res.status(200).send({})
}

export { signout };