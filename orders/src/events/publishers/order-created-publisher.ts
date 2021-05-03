import {Publisher,OrderCreatedEvent,Subjects} from '@ticket-micro-srv/common';

// look at the base publisher in the common lib and the nats-test example
//for better understanding
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> 
{

    //subject: Subjects.OrderCreated = Subjects.OrderCreated;
    readonly subject = Subjects.OrderCreated;
   

}