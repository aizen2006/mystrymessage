import mongoose , {Schema , Document} from 'mongoose';

export interface Message extends Document{
    content:string;
    createdAt:Date;
}

const MessageSchema : Schema<Message> = new Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema : Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username is Required"],
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        match:[/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,"please enter a valid email"]
    },
    password: {
        type:String,
        required:[true,"Password is Required"],
    },
    verifyCode:{
        type:String,
        required:[true,"VerifyCode is Required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"VerifyCodeExpiry is Required"],
    },
    isVerified:{
        type:Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type:Boolean,
        default: true,
    },
    messages:{
        type:[MessageSchema],

    }
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;
