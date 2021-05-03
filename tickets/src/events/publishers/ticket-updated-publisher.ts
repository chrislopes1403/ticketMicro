import { Publisher, Subjects, TicketUpdatedEvent } from '@ticket-micro-srv/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
