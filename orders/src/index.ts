import mongoose from 'mongoose';
import {app} from './app';
import {natsWrapper} from './nats-wrapper';
import {TicketUpdatedListener} from './events/listeners/ticket-updated-listener';
import {TicketCreatedListener} from './events/listeners/ticket-created-listener';
import {ExpirationCompleteListener} from './events/listeners/expiration-complete-listener';
import {PaymentCreatedListener} from './events/listeners/payment-created-listener';
import { Ticket } from './models/ticket';

// we connect to the kubernetes container serivce. if the db doesnt exist create one
const mongooseConnection = async ()=>
{
    
    if(!process.env.JWT_SECRET)
    {
        throw new Error('JWT_SECRET is undefined');   
    }
    if(!process.env.ORDERS_MONGO_URL)
    {
        throw new Error('ORDERS_MONGO_URL is undefined');   
    }
    if(!process.env.NATS_SERVICE_URL)
    {
        throw new Error('NATS_SERVICE_URL is undefined');   
    }
    if(!process.env.NATS_TICKET_CLUSTER_ID)
    {
        throw new Error('NATS_TICKET_CLUSTER_ID is undefined');   
    }

    if(!process.env.NATS_TICKET_CLIENT_ID)
    {
        throw new Error('NATS_TICKET_CLIENT_ID is undefined');   
    }
    try
    {
        //clusterid clientid url
        await natsWrapper.connect(process.env.NATS_TICKET_CLUSTER_ID, process.env.NATS_TICKET_CLIENT_ID,process.env.NATS_SERVICE_URL);



        
        natsWrapper.client.on('close',()=>{
            console.log(`Nats Wrapper Connection  closed! `);
            process.exit();
        });

        process.on('SIGINT',()=>{ natsWrapper.client.close()});
        process.on('SIGTERM',()=>{ natsWrapper.client.close()}); 

        /*Listeners*/
        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.ORDERS_MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex:true
        });
        console.log('Mongoose connection made!');
    } catch (err)
    {
        console.error(err);
    }

};
app.listen(3000,()=>{
    console.log('Orders Server on port 3000 !!!!!');
});


mongooseConnection();