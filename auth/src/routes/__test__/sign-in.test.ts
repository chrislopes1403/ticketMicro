import request from 'supertest';
import {app} from './../../app';


it('returns a 400  email does not exist',async()=>{

    await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(400);

});


it('returns a 400 with invlaid password',async()=>{

    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(201);


        await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'passwosdfsdfrd'
        })
        .expect(400);

});

it('sets a cookie after signin',async()=>{



    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'password'
    })
    .expect(201);


    
    const res = await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(200);

        // look at the app cookie setup
        expect(res.get('Set-Cookie')).toBeDefined();


});

