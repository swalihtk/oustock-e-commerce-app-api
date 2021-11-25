const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    orderDetails: [
      { address: {}, products: [], status: [], totalPrice: Number, paymentMethod:String, date:{
        type:Date,
        default:new Date()
      } },
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
);

module.exports = mongoose.model("orders", orderSchema);
