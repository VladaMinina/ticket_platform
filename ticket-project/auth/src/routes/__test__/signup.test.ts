import request from 'supertest';
import { app } from '../../app';

it('return 201 success signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
}, 20000)

it('return 400 failed signup invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'password'
        })
        .expect(400);
}, 20000)

it('return 400 faile signup invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtwo@test.com',
            password: 'pa'
        })
        .expect(400);
}, 20000)

it('return 400 failed signup only email or password provided', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password'
        })
        .expect(400);
    
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
        })
       .expect(400);   
}, 20000)

it('disallows duplicate emailes', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201); 
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
    .expect(400); 
}, 20000)

it('sets the cookie after successfully signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201); 

    expect(response.get('Set-Cookie')).toBeDefined();
} )