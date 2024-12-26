import {ExpirationCompleteListener} from '../expiration-complete-listener';
import {natsWrapper} from '../../../nats-singleton';
import {Ticket} from '../../../models/ticket';
import {Order} from '../../../models/order';
import {OrderStatus, ExpirationCompleteEvent} from '@vm-kvitki/common-lib';
import { Message } from 'node-nats-streaming';

const setup = async() => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: global.getObjectId(),
        title: 'movie',
        price: 20,
    });

    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: global.getObjectId(),
        expiresAt: new Date(),
        ticket: ticket,
    })

    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return {listener, order, ticket, data, msg}
}

it('it updates status to cancelled', async () => {
    const {listener, order, ticket, data, msg} = await setup();
    await listener.onMessage(data, msg);

    const updateOrder = await Order.findById(order.id);

    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled)
});

it('emits event expiration:complete', async () => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const dataEvent = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1] //[0][0] -> chanel whwre we posted
    );
    expect(dataEvent.id)
})

it('ack the msg', async () => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})