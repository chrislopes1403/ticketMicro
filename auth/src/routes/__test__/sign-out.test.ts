import request from 'supertest';
import {app} from './../../app';


it('clears cookie after signout',async()=>{

    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(201);

        const res = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

        // look at the app cookie setup
        expect(res.get('Set-Cookie')).toBeDefined();
});
