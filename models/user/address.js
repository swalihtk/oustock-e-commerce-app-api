const mongoose = require("mongoose");

const addressShema = new mongoose.Schema({
  fullName: String,
  locality: String,
  mobileNu: String,
  pincode: String,
  address: String,
  town: String,
  state: String,
  landmark: String,
});

module.exports = addressShema;
