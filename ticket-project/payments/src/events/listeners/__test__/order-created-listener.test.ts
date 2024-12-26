import {natsWrapper} from '../../../nats-singleton';
import { OrderCreatedListener } from '../order-created-listener';
import {OrderCreatedEvent, OrderStatus} from '@vm-kvitki/common-lib';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/orders';

const setup = () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: global.getObjectId(),
        version: 0,
        status: OrderStatus.Created,
        userId: global.getObjectId(),
        expiresAt: new Date().toISOString(),
        ticket: {
            id: global.getObjectId(),
            price: 100,
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, data, msg};
};

it('saves replica of order', async () => {
    const {listener, data, msg} = setup();

    await listener.onMessage(data,  msg);

    const order = await Order.findById(data.id);

    expect(order!.id).toEqual(data.id);
    expect(order!.price).toEqual(data.ticket.price);
});

it('ack the messsage', async () => {
    const {listener, data, msg} = setup();

    await listener.onMessage(data,  msg);

    expect(msg.ack).toHaveBeenCalled();

    // const dataEvent = JSON.parse(
    //     (natsWrapper.client.publish as jest.Mock).mock.calls[0][1] //[0][0] -> chanel whwre we posted
    // );
    // console.log(dataEvent);
    // expect(dataEvent.id).toEqual(data.id);
})