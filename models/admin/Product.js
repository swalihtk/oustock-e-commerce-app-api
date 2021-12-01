const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    productImages: [
      {
        img: { type: String },
      },
    ],
    color: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: [],
    quantity: { type: Number },
    discription:{type:String},
    offer:{
      offerPrice:{type:Number},
      expireDate:{type:String},
      offerName:{type:String},
      offerId:{type:String}
    }
  },
  {
    timestamps: true,
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  }
);

module.exports = mongoose.model("products", productSchema);
