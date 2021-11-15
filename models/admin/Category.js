const mongoose=require("mongoose");


const categorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    subCategery:[],
    tags:[]
}, {timestamps:true,
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
      }
})


const categeryModel=mongoose.model("category", categorySchema);

module.exports=categeryModel;