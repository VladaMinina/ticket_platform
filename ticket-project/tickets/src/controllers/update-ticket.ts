import {Request, Response} from 'express';
import {Ticket} from '../models/ticket';
import { BadRequestError, NotAutorizedError, NotFoundError } from '@vm-kvitki/common-lib';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper} from '../nats-singleton';
import { TicketDoc } from '../models/ticket';

export const updateTicket = async (req: Request, res: Response): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id) as TicketDoc;
    if(!ticket){
        throw new NotFoundError();
    }

    if(ticket.userId !== req.currentUser!.id) {
        throw new NotAutorizedError();
    }

    if(ticket.orderId) {
        throw new BadRequestError('This ticket have been already reserved');
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price,
    });
    await ticket.save();
    console.log(ticket);   
     
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
    });

    res.send(ticket);
}