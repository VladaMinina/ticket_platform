import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global{
    var getCookie: () => string[];
}

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    process.env.JWT_KEY = 'vlada';
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log('MongoMemoryServer URI:', uri);

    await mongoose.connect(uri, {
    });
    console.log('Connected to MongoMemoryServer');
});

beforeEach(async() => {
    if(mongoose.connection.db){
        const collections = await mongoose.connection.db.collections();
    for(let collection of collections) {
        await collection.deleteMany({});
    }
}
})

afterAll(async() => {
    if(mongoServer) {
        mongoServer.stop();
    }
    await mongoose.connection.close();
})

global.getCookie = () => {
    const payload = {
        email: 'test@test.com',
        id: '123456789'
    }

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const sessionJSON = JSON.stringify(session);

    const  base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];
}