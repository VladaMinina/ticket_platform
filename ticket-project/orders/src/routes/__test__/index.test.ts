import request from 'supertest';
import {app} from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket, TicketDoc } from '../../models/ticket';

const createTicket = async(title: string, price: number) => {
    const ticket =  Ticket.build({
        title,
        price
    });

    await ticket.save();
    return ticket;
};

it('successfully fetch orders for particular user', async () => {
    const userOne = global.getCookie();
    const userTwo = global.getCookie();

    const ticketFirst = await createTicket('for user 1', 19);
    const ticketSecond = await createTicket('for user 2', 19);
    const ticketThree = await createTicket('for user 2.1', 19);


    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId: ticketFirst.id})
        .expect(201)
    const {body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketSecond.id})
        .expect(201)
    const {body: orderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketThree.id})
        .expect(201)
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200)
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketSecond.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});

// it('success reserve ticket', async () => {
//     const cookeie = global.getCookie();

//     const ticket = Ticket.build({
//         title: 'NEW',
//         price: 20
//     });

//     await ticket.save();

//     await request(app)
//         .post('/api/orders')
//         .set('Cookie', cookeie)
//         .send({ticketId: ticket.id})
//         .expect(201)
// });