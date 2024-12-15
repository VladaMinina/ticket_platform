import {Request, Response} from 'express';
import {Ticket} from '../models/ticket';
import { NotAutorizedError, NotFoundError } from '@vm-kvitki/common-lib';

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
    res.send(ticket);
}