import { Request, Response, NextFunction } from "express";
import { NotAutorizedError } from "../errors/not-autorized-error";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if(!req.currentUser) {
        throw new NotAutorizedError();
    }
    next();
}