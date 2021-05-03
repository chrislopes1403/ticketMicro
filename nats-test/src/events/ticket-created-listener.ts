
import {Listener} from './base-listener';
import {Message} from 'node-nats-streaming';
import {TicketCreatedEvent} from './ticket-created-event';
import {Subjects} from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> 
{

    //subject: Subjects.TicketCreated = Subjects.TicketCreated;
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service-queue-group';
    
    onMessage(data:TicketCreatedEvent['data'],msg:Message)
    {
        console.log(`Event data: ${data.title}`);
    
        msg.ack();
    }


}