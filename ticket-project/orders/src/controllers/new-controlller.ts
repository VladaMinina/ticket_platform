import { Request, Response, NextFunction } from "express";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
} from "@vm-kvitki/common-lib";
import { natsWrapper } from "../nats-singleton";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const EXPIRATION_WINDOW = 100 * 60;

export const newOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ticketId } = req.body;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }
  //find ticket
  //ensure it is not reserved (if ticket found in orders and status NOT cenceled)
  const isReserved = await ticket.isReserved();

  if (isReserved) {
    throw new BadRequestError("Ticket is already reserved");
  }
  //calculate experetion date
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW);
  //build order and save it in DB
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });

  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(), //UTC timeStanp
    version: order.version,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  });
  //publish an event
  await order.save();
  console.log("New order successfully created");
  res.status(201).send(order);
};
