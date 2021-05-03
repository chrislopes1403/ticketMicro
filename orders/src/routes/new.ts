import mongoose from 'mongoose';
import express, {Request,Response} from 'express';
import {body} from 'express-validator';
import {BadRequestError, 
    NotFoundError, 
    OrderStatus, 
    requireAuth,
    validateRequest} from '@ticket-micro-srv/common';
import {Ticket} from './../models/ticket';
import {Order} from './../models/order';

import {natsWrapper} from './../nats-wrapper';
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;


router.post('/api/orders',requireAuth,[

    body('ticketId').not().isEmpty()
    .custom((input:string)=>mongoose.Types.ObjectId.isValid(input))
    .withMessage('Ticket id is required'),

],validateRequest,async(req:Request,res:Response)=>{
    
    const {ticketId} = req.body;

    //Find the ticket the user is trying to order in the database
    const ticket= await Ticket.findById(ticketId);

    if(!ticket)
    {
        throw new NotFoundError();
    }

    //Check if the ticket is already reserved
    //Run query to look at all orders. find an order where the ticket
    // is the ticket we just found and the orders is not cancelled
    // If we find and order that means the ticket is reserved
    //def. of isReserved in ticket model
    const isReserved = await ticket.isReserved();
     

    if(isReserved)
    {
        throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish an event saying that the order was created
      
   const publisher = new OrderCreatedPublisher(natsWrapper.client);
   await publisher.publish({
        id:order.id,
        status:order.status,
        userId:order.userId,
        version:order.version,
        expiresAt: order.expiresAt.toISOString(),
        ticket:{
            id:ticket.id,
            price:ticket.price,
        }
    });
    
    res.status(201).send(order);
});







export { router as newOrderRouter };