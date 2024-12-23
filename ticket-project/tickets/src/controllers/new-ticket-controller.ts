import { Request, Response } from 'express';
import {Ticket} from '../models/ticket';
import {TicketCreatedPublisher} from '../events/publishers/ticket-created-publisher';
import {natsWrapper} from '../nats-singleton';

export const newTicketController = async( req: Request, res: Response ) => {
    console.log('I am inside');
    const {title, price}  = req.body;

    const ticket = Ticket.build({
        title, 
        price, 
        userId: req.currentUser!.id,
    });
    await ticket.save();
    console.log('Saved');
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
    });

    
    res.status(201).send(ticket);
}