import nats from 'node-nats-streaming';
import {TicketCreatedPublisher} from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222',
});

stan.on('connect', async () => {
    console.log("Publisher connected to NATS");

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
        id: '12',
        title: 'ticket',
        price: 12
    }); 
        } catch(err) {
            console.log(err);
        }

    stan.on('close', () =>{
        console.log('NATS closing publisher');
        process.exit();
    })

    // const data = {
    //     id: '12',
    //     title: 'ticket',
    //     price: 12
    // };

    // const json = JSON.stringify(data);

    // stan.publish('ticket:created', json, () => {
    //     console.log(
    //         "ticket:created data was published!"
    //     );
    // })
});

process.on('SIGINT', () => {
    stan.close();
})
process.on('SIGTERM', () => {
    stan.close();
})

