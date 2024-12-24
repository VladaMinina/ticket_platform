import {Listener, OrderCancelledEvent, Subjects} from '@vm-kvitki/common-lib';
import {queueGroupName} from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCanceledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) {
            throw new Error('Ticcket not found');
        }
        //update ticket as not being reserved
        ticket.set({orderId: undefined})
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