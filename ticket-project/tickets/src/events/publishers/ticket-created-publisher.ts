import {Publisher, Subjects, TicketCreatedEvent} from '@vm-kvitki/common-lib';


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}