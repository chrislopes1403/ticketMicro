import request from 'supertest';
import { signinRouter } from '../signin';
import {app} from './../../app';


it('returns with current user details',async()=>{

 

        // we have to manually set the cookie a supertest has no browser cookie support
        const cookie = await global.signin();


        const res = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie',cookie)
        .send()
        .expect(200);

        console.log(res.body.currentUser)
        // look at the app cookie setup
        expect(res.body.currentUser.email).toEqual('test@test.com');
});



it('returns null not athenticated',async()=>{

 

    // we have to manually set the cookie a supertest has no browser cookie support
    const cookie = await global.signin();


    const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

    console.log(res.body.currentUser)
    // look at the app cookie setup
    expect(res.body.currentUser).toEqual(null);
});