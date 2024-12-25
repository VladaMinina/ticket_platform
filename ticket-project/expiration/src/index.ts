import { natsWrapper } from './nats-singleton';

const start = async() => {
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
    } catch (err) {
        console.log(err);
    }
}

start();