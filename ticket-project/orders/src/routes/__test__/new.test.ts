import request from 'supertest';
import {app} from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-singleton';

it('returns error if ticket does not exists', async () => {
    const ticketId = global.getObjectId();
    const cookeie = global.getCookie();

    await request(app)
        .post('/api/orders')
        .set('Cookie', cookeie)
        .send({ticketId})
        .expect(404);
});

it('returns error if ticket reserved', async () => {
    const ticket = Ticket.build({
        title: 'NEW',
        price: 20
    });

    await ticket.save();
    const order = Order.build({
        ticket,
        userId: '123445',
        status: OrderStatus.Created,
        expiresAt:  new Date(Date.now() + 6000 * 1000),
    });
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.getCookie())
        .send({ticketId: ticket.id})
        .expect(400)
});

it('success reserve ticket', async () => {
    const cookeie = global.getCookie();

    const ticket = Ticket.build({
        title: 'NEW',
        price: 20
    });

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', cookeie)
        .send({ticketId: ticket.id})
        .expect(201)
});

it('publish event OrderCreated', async () => {
    const cookeie = global.getCookie();

    const ticket = Ticket.build({
        title: 'NEW',
        price: 20
    });

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', cookeie)
        .send({ticketId: ticket.id})
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})