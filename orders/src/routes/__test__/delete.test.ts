import mongoose from 'mongoose';

import request from 'supertest';
import {app} from './../../app';

import {Ticket} from './../../models/ticket';
import {Order, OrderStatus} from './../../models/order';

jest.mock('./../../nats-wrapper');



const BuildTicket = async(title:string) =>
{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title,
        price:20
    });
    await ticket.save();

    return ticket;
}



it('returns an order as cancelled',async ()=>{
    

    const ticket = await BuildTicket('concert');

    const user =global.signin();

    const {body:order} = await request(app).post('/api/orders').set('Cookie', user)
    .send({ticketId:ticket.id})
    .expect(201);

    const {body:fetchedOrder} = await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user)
    .send()
    .expect(204);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});


it.todo('emits and event saying the order was cancelled');
