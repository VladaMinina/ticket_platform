import {Request, Response} from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@vm-kvitki/common-lib';

const showTicket = async (req: Request, res: Response)  => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    res.send(ticket);
}

export {showTicket};