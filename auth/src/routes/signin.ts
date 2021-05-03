import express,{Request,Response} from 'express';
import {body} from 'express-validator';
import {validateRequest,BadRequestError} from '@ticket-micro-srv/common';
import {User} from './../models/user';
import {Password} from './../services/password';
import jwt  from'jsonwebtoken';

const router = express.Router();


router.post('/api/users/signin',[
    body('email')
    .isEmail()
    .withMessage('Must be valid email'),
body('password')
    .trim()
    .notEmpty()
    .withMessage('Please provide a password')  
],
validateRequest,
async (req:Request,res:Response)=>{

    const {email,password} = req.body;
    
    const existingUser = await User.findOne({email});

    if(!existingUser)
    {
        throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(existingUser.password,password);

    if(!passwordMatch)
    {
        throw new BadRequestError('Invalid credentials');
    }

     //generate jwt
    // ! we personally check the type of JWT in the check 
    // in the mongo connect function in index 
    const userJwt = jwt.sign({
        id:existingUser.id,
        email:existingUser.email
    },process.env.JWT_SECRET!);


     //store it on a session
    //req.session for cookie-session
    req.session = {jwt:userJwt};

    res.status(200).send(existingUser);
});


export { router as signinRouter}