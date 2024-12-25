import Queue from 'bull';

interface Payload {
    orderId: string,
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST,
    }
});

expirationQueue.process(async (job) => {
    //TODO
    console.log('publish expiration complete event', job.data.orderId);
})

export { expirationQueue } 