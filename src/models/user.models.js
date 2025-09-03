import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({ 

    user:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
     email:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
     Fullname:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
         avatar:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String
    },
    watchHistory : [{
       type:  Schema.Types.ObjectId,
       ref:"video"
}],
passwrord:{
    type:String,
    required : [true,"Password is required"],
},
refreshToken:{
    type: String
},
    
},{timestamps:true}
)


userSchema .pre ("save", async function(next){
    if(!this.isModified("passeord")) return next ();

    this.password = bcrypt.hash(this.password, 10)
    next()
})  
userSchema.methods.isPasswordCorrect= async function(password){  
   return await bcrypt.compare(password,this.passwrord)
}
userSchema.methods.generateAccessToken=function(){
   return jwt.sign(
        {
            _id: this._id,
            email:this.email,
            username: this.username,
            fullname: this.fullname
        }
    ,
    process.env. Access_TOKEN_SECRET,
    {
        expiresIn: process>env>Access_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateAccessToken=function(){
return jwt.sign(
        {
            _id: this._id,
            email:this.email,
            username: this.username,
            fullname: this.fullname
        }
    ,
    process.env. Access_TOKEN_SECRET,
    {
        expiresIn: process>env>Access_TOKEN_EXPIRY
    }
    )


} 
export const user = mongoose.model('User', userSchema);