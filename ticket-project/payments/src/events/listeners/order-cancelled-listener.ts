import { OrderCancelledEvent, Subjects, Listener, OrderStatus} from '@vm-kvitki/common-lib';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/orders';
import { Message } from 'node-nats-streaming';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findByIdAndVersion({id: data.id, version: data.version - 1});
        
        // findOne({
        //     id: data.id,
        //     version: data.version - 1,
        // });
        
        if(!order) {
            throw new Error('Order not found');
        }
        order.set({status: OrderStatus.Cancelled});
        await order.save();

        msg.ack();
    }
}