import request from 'supertest';
import {app} from '../../app';
import { Order } from '../../models/orders';
import { OrderStatus } from '@vm-kvitki/common-lib';
import { stripe } from '../../stripe';

jest.mock('../../stripe.ts')

it('returns 404 for purchasing that doesnt exist', async() => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getCookie())
        .send({
            token: '123',
            orderId: global.getObjectId(),
        })
        .expect(404)
})

it('returns 401 whan purchasing an order that doesnt belong to the user', async() => {
    const order =  Order.build({
        id: global.getObjectId(),
        status: OrderStatus.Created, 
        version: 0,
        userId: global.getObjectId(),
        price: 15
    })

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getCookie())
        .send({
            token: '123',
            orderId: order.id,
    })
    .expect(401)
})

it('returns 400 when purchasing a cancelled order', async () => {
    const user = global.getObjectId();

    const order = Order.build({
        id: global.getObjectId(), 
        status: OrderStatus.Cancelled,
        version: 0,
        userId: user, 
        price: 15,
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getCookie(user))
        .send({
            orderId: order.id, 
            token: '123',
        })
        .expect(400);
});

it('returns 201 with valid inputs', async () => {
    const userId = global.getObjectId();

    const order = Order.build({
        id: global.getObjectId(),
        status: OrderStatus.Created,
        version: 0,
        userId: userId,
        price: 15,
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getCookie(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id,
        })
        .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(15 * 100);
    expect(chargeOptions.currency).toEqual('usd');
});
