import { OrderCancelledEvent } from "@vm-kvitki/common-lib"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-singleton"
import { OrderCanceledListener } from "../order-cancelled-listener"
import { Message } from "node-nats-streaming"

const setup = async() => {
    const listener = new OrderCanceledListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: 'movie',
        price: 20,
        userId: global.getObjectId()
    });
    ticket.set({orderId : global.getObjectId()})
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: ticket.orderId!,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {msg, data, ticket, orderId: ticket.orderId, listener}
}

it('updates ticket, publish new event, acks message', async () => {
    const {msg, data, ticket, orderId, listener} = await setup();

    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    //@ts-ignore
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
