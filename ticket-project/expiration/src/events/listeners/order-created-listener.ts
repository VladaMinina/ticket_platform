import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@vm-kvitki/common-lib";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting: ", delay);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: 100000,
      }
    );

    msg.ack();
  }
}
