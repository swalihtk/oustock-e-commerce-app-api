const mongoose=require("mongoose");

const bannerSchema=new mongoose.Schema({
    poster_image:{type:String, required:true},
    title:{type:String, required:true},
    link:{type:String, required:true}
},  {timestamps:true,
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
      }
})


module.exports=mongoose.model("banners", bannerSchema);