const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  Product_Name: { type: String, required: true },
  Rate: { type: Number, required: true },
  Unit: { type: String, required: true }
});

module.exports = mongoose.model("Product", ProductSchema);
