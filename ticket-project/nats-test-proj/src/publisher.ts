import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222',
});

stan.on('connect', () => {
    console.log("Publisher connected to NATS");

    stan.on('close', () =>{
        console.log('NATS closing publisher');
        process.exit();
    })

    const data = {
        id: '12',
        title: 'ticket',
        price: 12
    };

    const json = JSON.stringify(data);

    stan.publish('ticket:created', json, () => {
        console.log(
            "ticket:created data was published!"
        );
    })
});

process.on('SIGINT', () => {
    stan.close();
})
process.on('SIGTERM', () => {
    stan.close();
})

