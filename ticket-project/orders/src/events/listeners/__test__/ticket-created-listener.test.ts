import {TicketCreatedListener} from '../ticker-created-listener';
import {natsWrapper} from '../../../nats-singleton';
import {TicketCreatedEvent} from '@vm-kvitki/common-lib';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket }  from '../../../models/ticket';

const setup = async() => {
    //create listener 
    const listener = new TicketCreatedListener(natsWrapper.client)
    //create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'new',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }
    //create fake message obj
    
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it('creates and saves a ticket', async ()=> {
    const {listener, data, msg } = await setup();

    //call onMessage func with data obj and msg obj
    await listener.onMessage(data, msg);

    //write assertion to make sure that ticket was createt
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
})

it('acks the message', async ()=> {
    const {listener, data, msg } = await setup();
    //call onMessage func with data obj and msg obj
    await listener.onMessage(data, msg);

    //write assertion to make sure that ticket was createt
    expect(msg.ack).toHaveBeenCalled();
})