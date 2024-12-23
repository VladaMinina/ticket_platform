import { getJSDocReturnType } from 'typescript';
import {Ticket} from '../ticket';

it('test concurrenncy issue', async() => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });

    await ticket.save();

    const fetchedOne = await Ticket.findById(ticket.id);
    const fetchedTwo = await Ticket.findById(ticket.id);

    fetchedOne!. set({price: 10});
    fetchedTwo!. set({price: 70});
    await fetchedOne!.save();
     
    try{
        await fetchedTwo!.save();
    } catch(err) {
        return;
    }
    throw new Error('Should not reach')
});

it('test versioning control', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123',
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
    await ticket.save();
    expect(ticket.version).toEqual(3);
});
