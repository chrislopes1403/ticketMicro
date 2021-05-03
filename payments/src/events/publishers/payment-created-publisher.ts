import { Publisher, PaymentCreatedEvent, Subjects } from '@ticket-micro-srv/common';

// look at the base publisher in the common lib and the nats-test example
//for better understanding
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>
{

    //subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    readonly subject = Subjects.PaymentCreated;


}