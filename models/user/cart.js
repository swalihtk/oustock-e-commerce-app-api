const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: String,
        quantity: Number,
      },
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

module.exports = mongoose.model("cart", cartSchema);
