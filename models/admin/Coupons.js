const mongoose=require("mongoose");

const couponSchema=new mongoose.Schema({
    couponCode:{type:String, required:true},
    expires:{type:String, required:true},
    discount:{type:Number, required:true}
},
{
    timestamps:true,
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
      }
})

module.exports=mongoose.model("coupons", couponSchema);