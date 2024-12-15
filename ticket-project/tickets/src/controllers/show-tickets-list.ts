import {Request, Response} from 'express';
import {Ticket} from '../models/ticket';

export const showTicketsList = async (req: Request, res: Response): Promise<void> => {
    const tickets = await Ticket.find({});
    res.send(tickets);
}