const mongoose=require("mongoose");

const offerSchema=new mongoose.Schema({
    offerName:{
        type:String,
        required:true
    },
    percentage:{
        type:Number,
        required:true
    },
    expireDate:{
        type:String,
        required:true
    },
}, {
    timestamps:true,
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
      }
})

module.exports=mongoose.model("offers", offerSchema);