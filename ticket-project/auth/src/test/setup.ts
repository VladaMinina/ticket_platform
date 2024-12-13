import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

declare global{
    var getCookie: () => Promise<string[]>;
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

global.getCookie = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password,
        })
        .expect(201)

    const cookie = response.get('Set-Cookie');
    if(!cookie) {
        throw new Error('Failed to get cookie from response');
    }
    return cookie;
}