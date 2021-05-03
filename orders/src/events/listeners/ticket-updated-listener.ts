import {Message} from 'node-nats-streaming';
import {Subjects,Listener,TicketUpdatedEvent} from '@ticket-micro-srv/common';
import {queueGroupName} from './queue-group-name';
import { Ticket } from '../../models/ticket';


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>
{
   //subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
   readonly subject = Subjects.TicketUpdated;

   queueGroupName = queueGroupName;

   async onMessage(data:TicketUpdatedEvent['data'],msg:Message)
   {
        const {id,title ,price} = data;

        const ticket = await Ticket.findByEvent(data);

        if(!ticket)
        {
            throw new Error('Ticket not found');
        }

        ticket.set({title,price});
        await ticket.save();

        msg.ack(); //successfully consumed an event
   }
}