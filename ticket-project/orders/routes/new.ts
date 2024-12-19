import {newOrderController} from '../controllers/new-controlller';
import express from 'express';
import {requireAuth, validateRequest} from '@vm-kvitki/common-lib';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/api/orders',requireAuth,[
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input:string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId MUST be provided')
], validateRequest, newOrderController);

export {router as newOrderRouter};