import {Publisher} from '../../../common-lib/src/events/publisher-class';
import {TicketCreatedEvent} from '../../../common-lib/src/events/ticket-created-event';
import {Subjects} from '../../../common-lib/src/events/subject';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}