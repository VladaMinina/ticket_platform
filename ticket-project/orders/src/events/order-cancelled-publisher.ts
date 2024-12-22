import { Publisher, OrderCancelledEvent, Subjects} from '@vm-kvitki/common-lib';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}