import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global{
    var getCookie: (userId?: string) => string[];
    var getObjectId:() => string;
}

let mongoServer: MongoMemoryServer;
jest.mock('../nats-singleton.ts');

beforeAll(async () => {
    process.env.JWT_KEY = 'vlada';
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log('MongoMemoryServer URI:', uri);

    await mongoose.connect(uri, {
    });
    console.log('Connected to MongoMemoryServer');
});

process.env.STRIPE_KEY = 'sk_test_51QaI1LIeVDaGAabHFSXKpZySUiuFUW2arKkmeqtQn0BF9N6ddVCODiAIVIIE1F65vWYv4FFUCYwed0sZYT0woApX00zqGUTQZz'

beforeEach(async() => {
    jest.clearAllMocks();
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

global.getObjectId = () => {
    return new mongoose.Types.ObjectId().toHexString();;
}

// global.getCookie = () => {
//     const payload = {
//         email: 'test@test.com',
//         id: getObjectId()
//     }

//     const token = jwt.sign(payload, process.env.JWT_KEY!);
//     const session = { jwt: token };
//     const sessionJSON = JSON.stringify(session);
//     const  base64 = Buffer.from(sessionJSON).toString('base64');

//     return [`session=${base64}`];
// }

global.getCookie = (userId?: string) => {
    const payload = {
        id: userId || global.getObjectId(), // Use the passed userId or generate one
        email: 'test@test.com',
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const sessionJSON = JSON.stringify(session);
    const  base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];
};