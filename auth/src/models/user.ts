import mongoose from 'mongoose';
import {Password} from './../services/password';

//see v256 for details
//interface for the properties of creating a new user
interface UserAttributes{
    email:string;
    password:string;
}
//interface that describes that properties of a user model
interface UserModel extends mongoose.Model<UserDoc>
{
    build(attributes:UserAttributes):UserDoc;
}

//interface for a single user document
interface UserDoc extends mongoose.Document{
    email:string;
    password:string;
}


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require: true
    },
    password:{
        type:String,
        require: true
    }
},{
    toJSON:{
     transform(doc,ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
     }   
    }
});

// we want to customise or normalize the data coming out
// of mongodb for toJSON above we want id to be id: and not _id: also
// we dont want to return password or version


// only required because we want to hash a password
userSchema.pre('save',async function(done){

    if(this.isModified('password'))
    {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password',hashed);
    }

    done();
});


userSchema.statics.build=(attributes:UserAttributes)=>{
    return new User(attributes);
};

const User = mongoose.model<UserDoc,UserModel>('User',userSchema);


export {User};