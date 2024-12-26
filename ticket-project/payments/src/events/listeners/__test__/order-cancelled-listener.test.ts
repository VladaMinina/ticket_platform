import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-singleton"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCancelledEvent, OrderStatus} from '@vm-kvitki/common-lib';
import { Order } from "../../../models/orders";


const setup = async() => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    const orderId = global.getObjectId();
    const userId = global.getObjectId();

    const order = Order.build({
        id: orderId,
        status: OrderStatus.Created,
        version: 0,
        price: 100,
        userId: userId,
    })

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 1,
        ticket: {
            id: global.getObjectId(),
        }
    }

    return { listener, order, msg, data }
}

it('changes order statut', async () => {
     const { listener, msg, data } = await setup();

     await listener.onMessage(data, msg);

     const changedOrder = await Order.findById(data.id);
     expect(changedOrder!.id).toEqual(data.id);
     expect(changedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('ack message', async () => {
    const { listener, msg, data } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})