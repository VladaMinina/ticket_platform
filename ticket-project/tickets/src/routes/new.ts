import express, { Request, Response, NextFunction } from "express";
import { newTicketController } from '../controllers/new-ticket-controller';
import { requireAuth, validateRequest } from '@vm-kvitki/common-lib';
import { body } from 'express-validator';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0})
        .withMessage('Price should be greater than 0')
],
validateRequest, newTicketController);

export { router as createTicketRouter }