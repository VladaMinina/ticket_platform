import {Listener, OrderCreatedEvent, Subjects} from '@vm-kvitki/common-lib';
import {queueGroupName} from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        //find ticket
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) {
            throw new Error('Ticcket not found');
        }
        //mark ticket as being reserved
        ticket.set({orderId: data.id})
        //save ticket
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            //@ts-ignore
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            //@ts-ignore
            orderId: ticket.orderId,
        })
        //ack msg
        msg.ack();
    }
}