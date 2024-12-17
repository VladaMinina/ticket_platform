import {Listener} from './listener-class';
import {Message} from 'node-nats-streaming';
import {TicketCreatedEvent} from './ticket-created-event';
import {Subjects} from './subject';
import { time } from 'console';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated ; //or use 'redonly' -> the same as final in Java
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message){
        console.log('Event data', data);
        console.log('ID:', data.id, ', PRICE:', data.price, ', TITLE:', data.title);
        msg.ack();
    }
}