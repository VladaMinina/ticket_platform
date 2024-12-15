import express from 'express';
import {Ticket} from '../models/ticket';
import {showTicket} from '../controllers/show-ticket';

const router = express.Router();

router.get('/api/tickets/:id', showTicket);

export {router as showTicketRouter}