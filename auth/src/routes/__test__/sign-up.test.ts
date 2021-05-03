import request from 'supertest';
import {app} from './../../app';


it('returns a 201 on successful signup',async()=>{

    return request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(201);

});


it('returns a 400 with invlaid email',async()=>{

    return request(app)
        .post('/api/users/signup')
        .send({
            email:'testtest.com',
            password:'password'
        })
        .expect(400);

});

it('returns a 400 with missing email and/or password',async()=>{

    await request(app)
        .post('/api/users/signup')
        .send({
            password:'password'
        })
        .expect(400);


    
        await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
        })
        .expect(400);


});

it('returns a 400 with invlaid input',async()=>{

    return request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
        })
        .expect(400);

});


it('returns a 400 duplicate email',async()=>{

    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(201);

        await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(400);

});


it('sets a cookie after signup',async()=>{

    const res = await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(201);

        // look at the app cookie setup
        expect(res.get('Set-Cookie')).toBeDefined();


});







