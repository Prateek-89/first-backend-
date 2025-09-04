import mongoose,{Schema} from "mongoose"

const subscriptionSchema= new schema ({
    subscriber:{
        type:Schema.Type.ObjectId,//One who is subscribing
        ref:"User"
    },
     Chanel:{
        type:Schema.Type.ObjectId,
        ref:"User"
    }
},{Timestamp:true})
export const Subscription = mongoose.model("Subscription",subscriptionSchema)