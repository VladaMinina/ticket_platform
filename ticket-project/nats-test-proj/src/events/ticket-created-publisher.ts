import {Publisher} from './publisher-class';
import {TicketCreatedEvent} from './ticket-created-event';
import {Subjects} from './subject';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}