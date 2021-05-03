import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import {errorHandler} from '@ticket-micro-srv/common';
import {NotFoundError} from '@ticket-micro-srv/common';
import {currentUser} from '@ticket-micro-srv/common';


import {indexOrderRouter} from './routes/index';
import {showOrderRouter} from './routes/show';
import {newOrderRouter} from './routes/new';
import {deleteOrderRouter} from './routes/delete';

const app = express();
app.set('trust proxy',true);// traffic is being proxied from ingress
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cookieSession({
        signed:false, // this may cause problems if other languages are used 
        secure: process.env.NODE_ENV !=='test'  // for https for cookie jest test
    })
);


//router routes========
app.use(currentUser);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(deleteOrderRouter);
app.use(showOrderRouter);


//===================

//if if all of are routes fail 
//then anything left will get filtered to this route
app.get('*',async (req,res,next)=>{ throw new NotFoundError()});

app.use(errorHandler);
//https://expressjs.com/en/guide/error-handling.html



export {app};
