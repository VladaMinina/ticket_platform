import request from 'supertest'
import {app} from '../../app'
import { Ticket } from '../../models/ticket';
it('router to /api/tickets for post', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    expect(response.status).not.toEqual(404);
});

it('router to /api/tickets accessible only if user signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})
    expect(response.status).toEqual(401);
});

it('returns status other than 401 if user signed in', async () => {

    const response = await request(app).post('/api/tickets').set('Cookie', global.getCookie()).send({});
    //console.log(response.status);
    expect(response.status).not.toEqual(401);
});

it('returns error for invalid title', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({
            title: '',
            price: 12
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({

            price: 12
        })
        .expect(400);
});

it('returns error for invalid price', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
        title: 'Ticket ',
        price: -10
    })
    .expect(400);

await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
        title: 'Ticket ',
    })
    .expect(400);
});

it('creates ticket', async () => {
    // TODO: add check to be sure that ticket was saved in DB
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({
            title: 'Valid title',
            price: 20
        })
        .expect(201);
    
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
});