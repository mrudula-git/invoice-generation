const mongoose = require("mongoose");

const InvoiceMasterSchema = new mongoose.Schema({
  Invoice_No: { type: Number, required: true },
  Invoice_Date: { type: Date, required: true },
  CustomerName: { type: String, required: true },
  TotalAmount: { type: Number, required: true }
});

module.exports = mongoose.model("InvoiceMaster", InvoiceMasterSchema);
