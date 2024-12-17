import { Request, Response } from 'express';
import {Ticket} from '../models/ticket';
import {TicketCreatedPublisher} from '../events/publishers/ticket-created-publisher';

export const newTicketController = async( req: Request, res: Response ) => {
    const {title, price}  = req.body;

    const ticket = Ticket.build({
        title, 
        price, 
        userId: req.currentUser!.id,
    });
    await ticket.save();
    new TicketCreatedPublisher(client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
    });

    
    res.status(201).send(ticket);
}