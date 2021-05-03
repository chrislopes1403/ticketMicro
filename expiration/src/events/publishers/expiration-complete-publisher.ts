import {Publisher,ExpirationCompleteEvent,Subjects} from '@ticket-micro-srv/common';


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> 
{

    //subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    readonly subject = Subjects.ExpirationComplete;
   

}