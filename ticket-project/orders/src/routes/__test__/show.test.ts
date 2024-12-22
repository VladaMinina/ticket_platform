import request from 'supertest';
import {app} from '../../app';
import {Ticket} from '../../models/ticket';
import {Order, OrderStatus} from '../../models/order';

const createTicket = async(title: string, price: number) => {
    const ticket =  Ticket.build({
        title,
        price,
        id: global.getObjectId()
    });

    await ticket.save();
    return ticket;
};

it('fetches the order successfully', async() => {
    //Create ticket
    const ticket = await createTicket('Ticket 1', 12);
    const user = global.getCookie();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201)
    //make a request to build an order with ticket
    const {body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
})

it('fetches the order that doesnt exists', async() => {
    //Create ticket
    const ticket = await createTicket('Ticket 1', 12);
    const user = global.getCookie();
    const orderId = global.getObjectId();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201)
    //make a request to build an order with ticket
    const {body: fetchedOrder } = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie', user)
        .send()
        .expect(404);
})

it('fetches the order that doesnt belong to user', async() => {
    //Create ticket
    const ticketOne = await createTicket('Ticket 1', 12);
    const user = global.getCookie();
    const userTwo = global.getCookie();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticketOne.id})
        .expect(201)

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', userTwo)
        .send()
        .expect(401);
})