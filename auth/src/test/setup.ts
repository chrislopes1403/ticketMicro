import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {app} from '../app';


declare global{
    namespace NodeJS{
        interface Global{
            signin():Promise<string[]>;
        }
    }
}



let mongo: any;

//hook function
//run before all tests
beforeAll(async()=>{

    //just for testing in local dev because or kubernetes 
    //secret is for cloud computing 
    process.env.JWT_SECRET='asdasd';
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri,{
        useNewUrlParser: true,
        useUnifiedTopology:true,
        useCreateIndex:true
    });
});

//run before each test
beforeEach(async()=>{
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections)
    {
        await collection.deleteMany({});
    }

});

//run after all tests
afterAll(async()=>{
    await mongo.stop();
    await mongoose.connection.close();
});



 global.signin =  async () =>{
    const email = 'test@test.com';
    const password = 'password';


   const res = await request(app)
    .post('/api/users/signup')
    .send({
        email,
        password
    })
    .expect(201);

    const cookie = res.get('Set-Cookie');

    return cookie;

};