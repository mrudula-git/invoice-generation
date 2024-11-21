const mongoose = require("mongoose");

const InvoiceDetailSchema = new mongoose.Schema({
  Invoice_Id: { type: mongoose.Schema.Types.ObjectId, ref: "InvoiceMaster", required: true },
  Product_Id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  Rate: { type: Number, required: true },
  Unit: { type: String, required: true },
  Qty: { type: Number, required: true },
  Disc_Percentage: { type: Number, required: true },
  NetAmount: { type: Number, required: true },
  TotalAmount: { type: Number, required: true }
});

module.exports = mongoose.model("InvoiceDetail", InvoiceDetailSchema);
