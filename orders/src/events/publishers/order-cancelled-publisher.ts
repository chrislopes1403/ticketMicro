import {Publisher,OrderCancelledEvent,Subjects} from '@ticket-micro-srv/common';

// look at the base publisher in the common lib and the nats-test example
//for better understanding
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> 
{

    //subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    readonly subject = Subjects.OrderCancelled;
   

}