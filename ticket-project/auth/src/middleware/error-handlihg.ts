import { Request, Response, NextFunction} from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('Error caught in errorHandler:..........', );
    if(err instanceof CustomError) {
            console.log('CustomError error handler');
          res.status(err.statusCode).send({ errors: err.serializeErrors() });
          return;
    }

    res.status(400).send({
        errors: [
            {message: "Something went wrong"}
        ]
    });
}