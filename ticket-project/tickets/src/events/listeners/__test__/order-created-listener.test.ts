import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-singleton"
import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus } from "@vm-kvitki/common-lib";

const setup = async () =>{
    const client = natsWrapper.client;
    const listener = new OrderCreatedListener(client);

    const ticket  = Ticket.build({
        title: 'new',
        price: 2,
        userId: global.getObjectId()
    })
    await ticket.save();
    const data: OrderCreatedEvent['data'] = {
        id: global.getObjectId(),
        version: 0,
        status: OrderStatus.Created,
        userId: global.getObjectId(),
        expiresAt: Date().toString(),
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    };

    // @ts-ignore
    const msg: Message= {
        ack: jest.fn()
    }
    return {listener, ticket, data, msg}
}

it('it sets userId of the ticket', async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);

    // @ts-ignore
    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('cause ack msg', async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket updated event', async () => {
    const {listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId)
})