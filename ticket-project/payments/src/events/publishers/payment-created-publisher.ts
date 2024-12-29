import {Subjects, Publisher, PaymentCreatedEvent} from '@vm-kvitki/common-lib';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}