const mongoose=require("mongoose");

const whishlistSchema=new mongoose.Schema(
    {
        userId: {
          type: String,
          required: true,
        },
        products: [
            
        ],
      },
      {
        timestamps: true,
        writeConcern: {
          w: "majority",
          j: true,
          wtimeout: 1000,
        },
      }
)

module.exports=mongoose.model("whishlist",whishlistSchema);