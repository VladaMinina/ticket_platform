import { Request, Response } from 'express';
import {Ticket} from '../models/ticket';

export const newTicketController = async( req: Request, res: Response ) => {
    const {title, price}  = req.body;

    const ticket = Ticket.build({
        title, 
        price, 
        userId: req.currentUser!.id,
    });
    await ticket.save();
    
    res.status(201).send(ticket);
}