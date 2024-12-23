import {TicketUpdatedEvent} from '@vm-kvitki/common-lib';
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-singleton";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Message } from "node-nats-streaming";

const setup = async() =>{
    // create listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    //create and save ticket
    const ticket = Ticket.build({
        id: global.getObjectId(),
        title: 'new',
        price: 10
    });

    await ticket.save();
    // create fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new title',
        price: 77,
        userId: global.getObjectId(),
    }
    // create a fake msg obj

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, ticket, msg }
}

it('listen ticket:updated event', async() => {
    const {listener, data, ticket, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticketUpdated = await Ticket.findById(ticket.id);

    expect(ticketUpdated!.title).toEqual(data.title);
    expect(ticketUpdated!.price).toEqual(data.price);
    expect(ticketUpdated!.version).toEqual(1);
});

it('acks the msg', async() => {
    const {listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('acks was not called if version doesnt match', async() => {
    const {listener, data, ticket, msg } = await setup();
    data.version = 15;
    try {
        await listener.onMessage(data, msg);
    } catch(err) {}
    
    expect(msg.ack).not.toHaveBeenCalled();
})