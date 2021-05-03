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


it('returns orders for a user',async ()=>{
    

    const ticket1 =  await BuildTicket('concert1');
    const ticket2 =  await BuildTicket('concert2');
    const ticket3 =  await BuildTicket('concert3');


    const userOne = global.signin();

    
    const response = await request(app).post('/api/orders').set('Cookie', userOne)
    .send({ticketId:ticket1.id})
    .expect(201);


    const userTwo = global.signin();

    //destructuring and renaming
    const {body:orderOne} = await request(app).post('/api/orders').set('Cookie', userTwo)
    .send({ticketId:ticket2.id})
    .expect(201);

    const {body:orderTwo} = await request(app).post('/api/orders').set('Cookie', userTwo)
    .send({ticketId:ticket3.id})
    .expect(201);

    const response4 = await request(app).get('/api/orders').set('Cookie', userTwo)
    .expect(200);



    expect(response4.body.length).toEqual(2);
    expect(response4.body[0].id).toEqual(orderOne.id);
    expect(response4.body[1].id).toEqual(orderTwo.id);
    expect(response4.body[0].ticket.id).toEqual(ticket2.id);
    expect(response4.body[1].ticket.id).toEqual(ticket3.id);

   
});
