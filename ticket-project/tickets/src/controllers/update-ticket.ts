import {Request, Response} from 'express';
import {Ticket} from '../models/ticket';
import { NotAutorizedError, NotFoundError } from '@vm-kvitki/common-lib';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper} from '../nats-singleton';

export const updateTicket = async (req: Request, res: Response): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id)
    if(!ticket){
        throw new NotFoundError();
    }

    if(ticket.userId !== req.currentUser!.id) {
        throw new NotAutorizedError();
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
    });

    res.send(ticket);
}