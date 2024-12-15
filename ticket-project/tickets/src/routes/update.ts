import express from 'express';
import {body} from 'express-validator'
import { updateTicket } from '../controllers/update-ticket';
import {
    requireAuth,
    NotAutorizedError,
    NotFoundError,
    validateRequest
} from '@vm-kvitki/common-lib';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
    body('title')
        .notEmpty()
        .withMessage('Title must be provided'),
    body('price')
        .isFloat({ gt: 0})
        .withMessage('Price must be more than 0')
], validateRequest, updateTicket);

export {router as updateTicketRouter};