import dotenv from "dotenv";
dotenv.config({
    path:"/Users/prateekkumar/Desktop/coding/backend-project/public/.env"
});
import connectDB from "./db/index.js";

connectDB();

/*
import express from "express";
const app = express ();

(async()=>{

try {
   await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
   app.on("error", (error)=>{
    console.log("error:",error)
    throw "error"
   })
   app.listen (process.env.PORT,()=>{
    console.log("app is listening on port", process.env.PORT);
    
   })
} catch (error) {
    console.log("Error in DB", error)
    throw error
    
}
})()
*/