import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const start = async () => {
  if(!process.env.JWT_SECRET)
  {
      throw new Error('JWT_SECRET is undefined');   
  }
  if(!process.env.TICKETS_MONGO_URL)
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


    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.TICKETS_MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Tickets server on port 3000!!!!!!!!');
  });
};

start();
