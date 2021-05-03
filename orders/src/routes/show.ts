import express, {Request,Response} from 'express';
import mongoose from 'mongoose';
import {param} from 'express-validator';
import {requireAuth,validateRequest,NotFoundError, NotAuthorizedError} from '@ticket-micro-srv/common';
import {Order} from './../models/order';


const router = express.Router();




router.get('/api/orders/:orderId',[
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

    res.send(order);
 
});







export { router as showOrderRouter };