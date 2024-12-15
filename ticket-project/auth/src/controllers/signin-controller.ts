import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import {Password} from '../services/password';
import { BadRequestError } from '@vm-kvitki/common-lib';

const signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        const passwordsMatch = await Password.compare(existingUser.password, password);

        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
            },
            process.env.JWT_KEY!
        );

        req.session = { jwt: userJwt };

        res.status(200).send(existingUser);
    } catch (err) {
        console.error('Error in signin route:', err);
        next(err); // Explicitly pass the error to the errorHandler
    }
};

// const signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const { email, password } = req.body;
//     const existingUser = await User.findOne({ email });

//     if (!existingUser) {
//         throw new BadRequestError('Invalid credentials');
//     }

//     const passwordsMatch = await Password.compare(
//         existingUser.password, 
//         password
//     );

//     if(!passwordsMatch) {
//         console.log('Before error');
//         throw new BadRequestError('Invalid credentials');
//         console.log();
//     }

//     //console.log(user._id); // ObjectId("64b7d3ebc25e3f15807b3abc")
//     //console.log(user.id); // "64b7d3ebc25e3f15807b3abc"
//     const userJwt = jwt.sign({
//         id: existingUser.id,
//         email: existingUser.email,
//         }, 
//         process.env.JWT_KEY!
//     )

//     req.session = {
//         jwt: userJwt
//     };

//     res.status(201).send(existingUser)
// }

export { signin };