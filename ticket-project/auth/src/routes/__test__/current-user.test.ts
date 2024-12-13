import request from 'supertest';
import { app } from '../../app';

it('current user detailes', async() => {
    const cookie = await getCookie();
    if(!cookie){
        throw Error('Cookie not provided');
    }
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('if current user not autorized, responds with nill', async() => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(401)
});