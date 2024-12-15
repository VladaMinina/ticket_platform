import express from 'express';
import { body } from 'express-validator'

import {signup} from '../controllers/signup-controller';
import { validateRequest } from '@vm-kvitki/common-lib';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email MUST be provided'),
    body('password')
        .trim()
        .isLength({min:4, max: 20})
        .withMessage('Password not provided or length must be from 4 to 20 chacacters')
], validateRequest, signup);

export {router as signupRouter};