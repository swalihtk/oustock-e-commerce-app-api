const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        trim:true,
    },
    lastname:{
        type:String,
        trim:true,
       
    },
    username:{
        type:String,
        lowercase:true,
        unique:true,
        required:true
    },
    email:{
        type:String,
        lowercase:true,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobileNu:{
        type:String
    },
    profileImage:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true,
        required:true
    },
    role:{
        enum:["user", "admin"],
        default:"user",
        type:String
    },
    address:[
        {
            fullName:{type:String},
            mobileNu:{type:String},
            pincode:{type:String},
            locality:{type:String},
            address:{type:String},
            town:{type:String},
            state:{type:String},
            alterPhon:{type:String},
            landmark:{type:String}
        }
    ]
    
}, {timestamps:true, 
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
      }
})



module.exports= mongoose.model("Users", userSchema);