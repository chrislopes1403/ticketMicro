import mongoose from 'mongoose';

import request from 'supertest';
import {app} from './../../app';

import {Ticket} from './../../models/ticket';
import {Order, OrderStatus} from './../../models/order';

import {natsWrapper} from './../../nats-wrapper';

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



it('returns an order',async ()=>{
    

    const ticket = await BuildTicket('concert');

    const user =global.signin();

    const {body:order} = await request(app).post('/api/orders').set('Cookie', user)
    .send({ticketId:ticket.id})
    .expect(201);

    const {body:fetchedOrder} = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user)
    .send()
    .expect(200);


    expect(fetchedOrder.id).toEqual(order.id);

});

it('returns not authorized for a user',async ()=>{
    

    const ticket = await BuildTicket('concert');

    const user =global.signin();

    const {body:order} = await request(app).post('/api/orders').set('Cookie', user)
    .send({ticketId:ticket.id})
    .expect(201);

    const {body:fetchedOrder} = await request(app).get(`/api/orders/${order.id}`).set('Cookie', global.signin())
    .send()
    .expect(401);

});

it('returns  a bad request for no/bad order provided',async ()=>{
    

    

    await request(app).get(`/api/orders/sdfsdfdddd`).set('Cookie', global.signin())
    .send()
    .expect(400);

});



