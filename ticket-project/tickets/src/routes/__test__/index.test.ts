import request from 'supertest';
import { app } from '../../app';

const createTicket = (title: string, price:number) => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({
            title, price
     })
};

it('success fetched list of tickets', async() => {
    await createTicket('new ticket 1', 10);
    await createTicket('new ticket 2', 20);
    await createTicket('new ticket 3', 30);

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200)

    expect(response.body.length).toEqual(3);
})