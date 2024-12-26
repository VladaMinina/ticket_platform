import request from 'supertest';
import {app} from '../../app';
import { Order } from '../../models/orders';
import { OrderStatus } from '@vm-kvitki/common-lib';

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

it('returns 400 whan purchasing a cancelled order', async() => {
    const user = global.getObjectId();
    const order =  Order.build({
        id: global.getObjectId(),
        status: OrderStatus.Cancelled, 
        version: 0,
        userId: user,
        price: 15
    })

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', user)
        .send({
            orderId: order.id,
            token: '123',
    })
    .expect(400)
})