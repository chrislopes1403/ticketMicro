import {Message} from 'node-nats-streaming';
import {Subjects,Listener,TicketCreatedEvent} from '@ticket-micro-srv/common';
import {queueGroupName} from './queue-group-name';
import { Ticket } from '../../models/ticket';


export class TicketCreatedListener extends Listener<TicketCreatedEvent>
{
   //subject: Subjects.TicketCreated = Subjects.TicketCreated;
   readonly subject = Subjects.TicketCreated; //look at the base listener and the subjects file this is
   // where the subscription is set to ticket:created

   queueGroupName = queueGroupName;

   async onMessage(data:TicketCreatedEvent['data'],msg:Message)
   {
        const {id,title ,price} = data;

        const ticket = Ticket.build({
            id,
            title,
            price
        });

        await ticket.save();

        msg.ack(); //successfully consumed an event
   }
}