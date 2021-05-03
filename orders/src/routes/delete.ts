import express, {Request,Response} from 'express';
import mongoose from 'mongoose';
import {param} from 'express-validator';
import {requireAuth,validateRequest,
    NotAuthorizedError,
    NotFoundError, 
    OrderStatus} from '@ticket-micro-srv/common';
import {Order} from './../models/order';

import {natsWrapper} from './../nats-wrapper';
import {OrderCancelledPublisher} from '../events/publishers/order-cancelled-publisher';


const router = express.Router();



router.delete('/api/orders/:orderId',requireAuth,[
    param('orderId').not().isEmpty()
    .custom((input:string)=>mongoose.Types.ObjectId.isValid(input))
    .withMessage(' Valid Order id is required'),
],validateRequest,async(req:Request,res:Response)=>{
    
    const {orderId} = req.params;

    const order  = await Order.findById(orderId).populate('ticket');

    if(!order)
    {
        throw new NotFoundError();
    }

    if(order.userId !==req.currentUser!.id)
    {
        throw new NotAuthorizedError();
    }

    order.status=OrderStatus.Cancelled;
    await order.save();
    //pubish an event saying the orer was cancel
   
    const publisher = new OrderCancelledPublisher(natsWrapper.client);
    await publisher.publish({
         id:order.id,
         version:order.version,
         ticket:{
             id:order.ticket.id,
         }
     });
    //204 means delete
    res.status(204).send(order);
 
});





export { router as deleteOrderRouter };