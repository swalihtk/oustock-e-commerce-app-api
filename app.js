const express=require("express");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const cors=require("cors");


const app=express();


// dotenv config
dotenv.config()

// app middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true
}))

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
const adminUserManage=require("./routers/admin/users");
const adminCategoryManage=require("./routers/admin/category");

app.use("/admin/auth", adminAuth);
app.use("/admin/users", adminUserManage);
app.use("/admin/category", adminCategoryManage);

// home

// product

// user
const auth=require("./routers/user/auth");
const account=require("./routers/user/account");

app.use("/user/auth", auth);
app.use("/user/account", account);

// shop

// app listening
app.listen(process.env.PORT, ()=>console.log("Server running on port "+process.env.PORT));