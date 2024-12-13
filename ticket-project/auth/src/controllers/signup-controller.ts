import { Request, Response, NextFunction } from 'express';

import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';

const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email already in use');
        }

        const user = User.build({email , password});
        await user.save();

        //console.log(user._id); // ObjectId("64b7d3ebc25e3f15807b3abc")
        //console.log(user.id); // "64b7d3ebc25e3f15807b3abc"
        const userJwt = jwt.sign({
                id: user.id,
                email: user.email,
            }, 
            process.env.JWT_KEY!
        )

        req.session = {
            jwt: userJwt
        };

        res.status(201).send(user)
    } catch (err) {
        console.error('Error in signup route:', err);
        next(err); // Explicitly pass the error to the errorHandler
    }
}

export { signup };