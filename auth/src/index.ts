import mongoose from 'mongoose';
import {app} from './app';

// we connect to the kubernetes container serivce. if the db doesnt exist create one
const mongooseConnection = async ()=>
{
    // do this before trying to get any env
    if(!process.env.JWT_SECRET)
    {
        throw new Error('JWT_SECRET is undefined');   
    }
    if(!process.env.AUTH_MONGO_URL)
    {
        throw new Error('AUTH_MONGO_URL is undefined');   
    }
    try
    {
        await mongoose.connect(process.env.AUTH_MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex:true
        });
        console.log('Mongoose connection made!');
    } catch (err)
    {
        console.error(err);
    }

};
app.listen(3000,()=>{
    console.log('Auth Server on port 3000 !!!!!');
});


mongooseConnection();