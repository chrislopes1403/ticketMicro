import nats, {Message,Stan} from 'node-nats-streaming';
import {randomBytes} from 'crypto';
import {TicketCreatedListener} from './events/ticket-created-listener';


//console.clear();
//client/stan
/*const id =randomBytes(4).toString('hex');
const client = nats.connect('ticketing',id,{
    url:'http://localhost:4222'
});


client.on('connect',()=>{
    console.log('Listener is connected to NATS');



    client.on('close',()=>{
        console.log(`Nats connection listener id:${id} closed! `);
        process.exit();
    });


   const options = client
   .subscriptionOptions()
   .setManualAckMode(true) //our service must now confirm it proccessed the event. this is for in case of internal db err for example
   .setDeliverAllAvailable()// on start get all events
   .setDurableName('accounting-service');
   const subscription= client.subscribe('ticket:created','orders-service-queue-group',options);

   //event===message
   subscription.on('message',(msg:Message)=>{
      const data = msg.getData();

      if(typeof data ==='string')
      {
          console.log('Event Number: ',msg.getSequence(),JSON.stringify(data))
      }

      msg.ack(); //confirm we proccess the message/event
   });


});


process.on('SIGINT',()=>{client.close()});
process.on('SIGTERM',()=>{client.close()});*/
//=============================================================


console.clear();
//client/stan
const id =randomBytes(4).toString('hex');
const client = nats.connect('ticketing',id,{
    url:'http://localhost:4222'
});


client.on('connect',()=>{
    console.log('Listener is connected to NATS');



    client.on('close',()=>{
        console.log(`Nats connection listener id:${id} closed! `);
        process.exit();
    });

    new TicketCreatedListener(client).listen();


});

// nats will stil try to send a stop proccess events because 
// the proccess will die before stan.close gets a chance to be called
// thus if the proccess is INT/interupted or TERM/terminated  
// call the stan.close
process.on('SIGINT',()=>{client.close()});
process.on('SIGTERM',()=>{client.close()});



/*

abstract class Listener {

    abstract subject:string;
    abstract queueGroupName: string;
    abstract onMessage(data:any,msg:Message):void;


    protected ackWait = 5 * 1000; //5ms

    private client :Stan;


    constructor(client:Stan)
    {
        this.client = client;
    }


    subscriptionOptions()
    {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message',(msg:Message)=>{
            console.log(`Message received SUBJECT: ${this.subject} QUEUE GROUP: ${this.queueGroupName}`);
        
        
            const parseData = this.parseMessage(msg);
            this.onMessage(parseData,msg);
        });
    }
 

    parseMessage(msg:Message)
    {
        const data = msg.getData();

        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    }


}


class TicketCreatedListener extends Listener 
{

    subject = 'ticket:created';
    queueGroupName = 'payments-service-queue-group';
    
    onMessage(data:any,msg:Message)
    {
        console.log(`Event data: ${data}`);
    
        msg.ack();
    }


}

*/