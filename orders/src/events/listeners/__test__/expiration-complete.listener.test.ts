import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {ExpirationCompleteEvent,OrderStatus} from '@ticket-micro-srv/common';
import {ExpirationCompleteListener} from '../expiration-complete-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Ticket} from '../../../models/ticket';
import {Order} from '../../../models/order';

const setup =async()=>
{
    //create an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);


    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
      });
      await ticket.save();
    
    const order = Order.build({
        status:OrderStatus.Created,
        userId:'dfgdfg',
        expiresAt: new Date(),
        ticket,
    });
    await order.save();


    //create a fake data event
    const data: ExpirationCompleteEvent['data']={
        orderId:order.id
    }


    //create a fake message object
    // we only want ine attribute hence ts-ginore
    //@ts-ignore
    const msg:Message = {
        ack:jest.fn()
    }


    return {listener,data,msg,order,ticket}
 
};



it('updateds an orders status to cancelled',async()=>{

    const {listener,data,msg,order,ticket} = await setup();
    //call the onMessage functionwith the data object
    //+ message object
    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});



it('emits an order cancelled event',async()=>{

    const {listener,data,msg,order,ticket} = await setup();
    //call the onMessage functionwith the data object
    //+ message object
    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(eventData.id).toEqual(order.id);
});


it('acks/acknowledges the message',async()=>{
    const {listener,data,msg,order,ticket} = await setup();
    //call the onMessage functionwith the data object
    //+ message object
    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();


});