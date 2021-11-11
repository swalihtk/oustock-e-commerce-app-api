const express=require("express");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");


const app=express();


// dotenv config
dotenv.config()

// app middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// mongoose connect
mongoose.connect(process.env.MONGODB, (err)=>{
    if(err){
        console.log("Error on connecting to database");
    }else{
        console.log("Database connected");
    }
})


// app routes

// admin
const adminAuth=require("./routers/admin/auth");
app.use("/admin/auth", adminAuth);

// home

// product

// user
const auth=require("./routers/user/auth");
app.use("/user/auth", auth);

// shop

// app listening
app.listen(process.env.PORT, ()=>console.log("Server running on port "+process.env.PORT));