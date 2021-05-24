import {Message} from 'node-nats-streaming';
import {Subjects,Listener,ExpirationCompleteEvent} from '@ticket-micro-srv/common';
import {queueGroupName} from './queue-group-name';
import { Order,OrderStatus } from '../../models/order';
import { OrderCancelledPublisher} from '../publishers/order-cancelled-publisher';
import { natsWrapper } from '../../nats-wrapper';
export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  queueGroupName = queueGroupName;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}