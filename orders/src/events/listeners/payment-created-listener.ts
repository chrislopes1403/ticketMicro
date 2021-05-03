import {Message} from 'node-nats-streaming';
import {Subjects,Listener,PaymentCreatedEvent,OrderStatus} from '@ticket-micro-srv/common';
import {queueGroupName} from './queue-group-name';
import { Order } from '../../models/order';


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>
{
   //subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
   readonly subject = Subjects.PaymentCreated; //look at the base listener and the subjects file this is
   // where the subscription is set to Payment:created

   queueGroupName = queueGroupName;

   async onMessage(data:PaymentCreatedEvent['data'],msg:Message)
   {
        const {orderId,stripeId} = data;

        const order = await Order.findById(orderId);

        if(!order)
        {
            throw new Error('Order not found');
        }

        order.set({status:OrderStatus.Complete});


        await order.save();
       

        msg.ack(); //successfully consumed an event
   }
}