import {Message} from 'node-nats-streaming';
import {Subjects,Listener,ExpirationCompleteEvent} from '@ticket-micro-srv/common';
import {queueGroupName} from './queue-group-name';
import { Order,OrderStatus } from '../../models/order';
import { OrderCancelledPublisher} from '../publishers/order-cancelled-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>
{
   //subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
   readonly subject = Subjects.ExpirationComplete; //look at the base listener and the subjects file this is
   // where the subscription is set to ticket:created

   queueGroupName = queueGroupName;

   async onMessage(data:ExpirationCompleteEvent['data'],msg:Message)
   {
        const order = await Order.findById(data.orderId).populate('ticket');

        if(!order)
        {
            throw new Error('Data not found');
        }

        if(order.status === OrderStatus.Complete)
        {
             return msg.ack(); //successfully consumed an event
        }

        order.set({
            status:OrderStatus.Cancelled,
        });
        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id:order.id,
            version:order.version,
            ticket:{
                id:order.ticket.id,
            }
        });

        msg.ack(); //successfully consumed an event
   }
}