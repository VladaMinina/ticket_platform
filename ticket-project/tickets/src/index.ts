import mongoose from 'mongoose';
import {app} from './app';
import { natsWrapper } from './nats-singleton';
import {OrderCanceledListener} from './events/listeners/order-cancelled-listener';
import {OrderCreatedListener} from './events/listeners/order-created-listener';

const start = async() => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be provided');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be provided');
    }
    if(!process.env.NATS_CLUSTER_ID || 
        !process.env.NATS_URL || 
        !process.env.NATS_CLIENT_ID ) {
            throw new Error('Variables for NATS service was not proveded');
        }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID, 
            process.env.NATS_CLIENT_ID, 
            process.env.NATS_URL
        );
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });

        process.on('SIGINT', () => {natsWrapper.client.close()});
        process.on('SIGTERM', () => {natsWrapper.client.close()});

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCanceledListener(natsWrapper.client).listen();
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to mongo");
    } catch (err) {
        console.log(err);
    }
}

app.listen(3000, () => {
    console.log("Listening on port 3000");
})

start();