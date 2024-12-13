import express from 'express';
import { body } from 'express-validator';

import {signin} from '../controllers/signin-controller';
import { validateRequest } from '../middleware/validate-request';

const router = express.Router();

router.post('/api/users/signin', 
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password must be provided')
    ], 
    validateRequest,
    signin
);

export {router as signinRouter};