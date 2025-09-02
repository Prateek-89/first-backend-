import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"

const app = express ()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials :true
}))
export { app }
 
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser)













connectDB()
.then(()=>{
app.listen(process.env.PORT) || 8000 , ()=>{
console.log(`Server is running on port ${process.env.PORT || 8000}`);
}})  
.catch((err)=>{
console.log("MongoDB connection error:", err);

})