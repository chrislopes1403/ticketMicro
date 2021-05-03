import express,{Request,Response} from 'express';
import jwt  from'jsonwebtoken';
import {validateRequest,BadRequestError} from '@ticket-micro-srv/common';
import {body} from 'express-validator';
import {User} from './../models/user';


const router = express.Router();


router.post('/api/users/signup',[
    body('email')
        .isEmail()
        .withMessage('Must be valid email'),
    body('password')
        .trim()
        .isLength({min:4, max:20})
        .withMessage('Password must be between 4 and 20 characters')
],
validateRequest,
async (req:Request,res: Response)=>{
   
    const {email,password} = req.body;

    const existingUser = await User.findOne({email});


    if(existingUser)
    {
        //custom error
        throw new BadRequestError('Email in use');
    }

    const user = User.build({email,password});
    await user.save(); 

    
    //generate jwt
    // ! we personally check the type of JWT in the check 
    // in the mongo connect function in index 
    const userJwt = jwt.sign({
        id:user.id,
        email:user.email
    },process.env.JWT_SECRET!);

    //store it on a session
    //req.session for cookie-session
    req.session = {jwt:userJwt};

    res.status(201).send(user);
});


export { router as signupRouter}