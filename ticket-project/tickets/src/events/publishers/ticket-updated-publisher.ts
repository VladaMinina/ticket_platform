import {Publisher, 
        Subjects, 
        TicketUpdatedEvent
    } from '@vm-kvitki/common-lib';


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}