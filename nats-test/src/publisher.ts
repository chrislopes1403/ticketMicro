import nats from 'node-nats-streaming';

import {TicketCreatedPublisher} from './events/ticket-created-publisher';

console.clear();
//client/stan
const client = nats.connect('ticketing','abc',{
    url:'http://localhost:4222'
});



client.on('connect',async ()=>{
    console.log('Publisher is connected to NATS');

    const publisher = new TicketCreatedPublisher(client);

    try{
    await publisher.publish({
        id:'123',
        title:'sdfsdf',
        price:20
    });
    }catch(err){
        console.log(err);
    }
    /*
    //data/message/event
   const data = JSON.stringify({
        id:'1231',
        title:'concert',
        price:20
    });

    // third function is a callback after publishing
    client.publish('ticket:created',data,()=>{
        console.log('Event Published');
    });
    */

});