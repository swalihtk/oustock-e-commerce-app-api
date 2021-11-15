const mongoose=require("mongoose");


const addressShema=new mongoose.Schema({
    fullName:String,
    locality:String,
    mobileNu:String,
    pinCode:String,
    address:String,
    town:String,
    state:String,
    alterPhone:String,
    landmark:String
}) 


module.exports=addressShema;