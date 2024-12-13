import mongoose from 'mongoose';
import { Password } from '../services/password';

//An interf that require to create new user
interface userAttrs{
    email: string;
    password: string;
}

//an interface that describes the properties 
//that user model has 

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: userAttrs):UserDoc;
}

// interf that describes that a User docum has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

//here is necessary to use function, not arrow function.
//cause if arrow (this = this entire file) if function (this = particular user that is in DB)
userSchema.pre('save', async function (done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build =  (attrs: userAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// Test
// const userN = User.build({
//     email: 'dfgerr',
//     password: 'vdvd'
// })
export { User }