import request from 'supertest';
import {app} from '../../app';
import {Ticket} from '../../models/ticket';

it('returns 404 if ticket not found', async () => {
    await request(app)
        .get(`/api/tickets/${global.getObjectId()}`)
        .set('Cookie', global.getCookie())
        .send({})
        .expect(404)
})

it('returns success if ticket found', async () => {
    const title = 'new ticket';
    const price = 20;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({
            title, price
        })
        .expect(201)
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.getCookie())
        .send({})
        .expect(200);
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
})