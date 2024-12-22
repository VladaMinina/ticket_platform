import request from 'supertest';
import { app } from '../../app';
import {Ticket} from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

const createTicket = async(title: string, price: number) => {
    const ticket =  Ticket.build({
        title,
        price
    });

    await ticket.save();
    return ticket;
};

it('marks an order as cancelled', async () => {
    //create ticket
    const ticket = await createTicket('ticket one', 15);
    const user = getCookie();

    //make a request to create order
    const {body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id})
        .expect(201)

    //make a request to cancel order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    //ensure that the order was cancelled
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits event for order cancelled')