import request from 'supertest';
import {app} from '../../app';
import {natsWrapper} from '../../nats-singleton';
import { Ticket } from '../../models/ticket';

const createTicket = async(title: string, price:number) => {
    return await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({
            title, price
     })
};


it('returns 404 if provided id doesnt exists', async() => {
    await request(app)
        .put(`/api/tickets/${global.getObjectId()}`)
        .set('Cookie', global.getCookie())
        .send({
            title: 'new title',
            price: 10
        })
        .expect(404)

})

it('returns 401 if user not autorized', async() => {
    await request(app)
    .put(`/api/tickets/${global.getObjectId()}`)
    .send({
        title: 'new title',
        price: 10
    })
    .expect(401)
})

it('returns 401 if user is not owner of ticket', async() => {
    const ticket = await createTicket('old ticket', 40);

    await request(app)
        .put(`/api/tickets/${ticket.body.id}`)
        .set('Cookie', global.getCookie())
        .send({
            title: 'new title',
            price: 1000
        })
    .expect(401);
})

it('returns 400 if user provides invalid price or title', async() => {
    const userCookie = global.getCookie();
    const ticket = await request(app)
        .post('/api/tickets')
        .set('Cookie', userCookie)
        .send({
            title: '', 
            price: 20
    })
    .expect(400);

    await request(app)
        .put(`/api/tickets/${ticket.body.id}`)
        .set('Cookie', userCookie)
        .send({
            title: 'new title',
            price: -1000
        })
    .expect(400);
})

it('success update with valid parameters', async() => {
    const userCookie = global.getCookie();
    const ticket = await request(app)
        .post('/api/tickets')
        .set('Cookie', userCookie)
        .send({
            title: 'old title', 
            price: 20
     })
    await request(app)
        .put(`/api/tickets/${ticket.body.id}`)
        .set('Cookie', userCookie)
        .send({
            title: 'new title',
            price: 1000
        })
    .expect(200);

    const ticketResponce = await request(app)
        .get(`/api/tickets/${ticket.body.id}`)
        .send();

    expect(ticketResponce.body.title).toEqual('new title');
    expect(ticketResponce.body.price).toEqual(1000);
})

it('mock funcktion was called', async () => {
    const userCookie = global.getCookie();
    const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie)
    .send({
        title: 'old title', 
        price: 20
 })
 await request(app)
        .put(`/api/tickets/${ticket.body.id}`)
        .set('Cookie', userCookie)
        .send({
            title: 'new title',
            price: 1000
        })
    .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
})

it('rejects update ticket that is recerved', async () => {
    const userCookie = global.getCookie();
    const ticket = await request(app)
        .post('/api/tickets')
        .set('Cookie', userCookie)
        .send({
            title: 'old title', 
            price: 20
     })

    const ticketDoc = await Ticket.findById(ticket.body.id);
    ticketDoc!.set({orderId: global.getObjectId()});
    await ticketDoc!.save();

    await request(app)
        .put(`/api/tickets/${ticket.body.id}`)
        .set('Cookie', userCookie)
        .send({
            title: 'new update',
            price: 70
        })
    .expect(400);
})