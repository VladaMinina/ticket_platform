import nats, {Message, Stan} from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('accounting-service');

    const subscription = stan.subscribe(
            'ticket:created', 
            'queue-group-name', 
            options
        );

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();
        if(typeof data === 'string') {
            console.log(`received string event #${msg.getSequence()}, with data: ${data}`);
        }
        console.log("Message received:", msg.getSubject());
        msg.ack(); 
    });
});

process.on('SIGINT', () => {
    stan.close();
})
process.on('SIGTERM', () => {
    stan.close();
})

abstract class Listner {
    private client: Stan;
    abstract subject: string;
    abstract queueGroupName: string;
    protected ackWait = 5 * 1000;
    abstract onMessage(data: any, msg: Message): void;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName)
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(
                `message received ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);

            this.onMessage(parsedData, msg)
        })
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf8'))
    }
}