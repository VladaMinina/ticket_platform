import express from 'express';
import { showTicketsList } from '../controllers/show-tickets-list';

const router = express.Router();

router.get('/api/tickets', showTicketsList);

export {router as getTicketsRouter};