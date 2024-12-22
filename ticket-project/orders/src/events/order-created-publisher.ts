import { Publisher, OrderCreatedEvent, Subjects} from '@vm-kvitki/common-lib';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}