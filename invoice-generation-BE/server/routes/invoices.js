const express = require("express");
const mongoose = require("mongoose");
const InvoiceMaster = require("../models/InvoiceMaster");
const InvoiceDetail = require("../models/InvoiceDetail");
const Product = require("../models/Product");

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { invoiceMaster, invoiceDetail } = req.body;
    console.log('Invoice saved:', { invoiceMaster, invoiceDetail });
    if (!invoiceMaster || !invoiceDetail || !Array.isArray(invoiceDetail)) {
      return res.status(400).json({ error: 'Invalid data structure' });
    }

    const newInvoiceMaster = new InvoiceMaster({
      Invoice_No: invoiceMaster.invoiceNo,
      Invoice_Date: invoiceMaster.invoiceDate,
      CustomerName: invoiceMaster.customerName,
      TotalAmount: invoiceMaster.totalAmount
    });

    await newInvoiceMaster.save();

    for (let item of invoiceDetail) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ error: `Invalid Product ID: ${item.productId}` });
      }

      const product = await Product.findById(item.productId); 
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.productId} not found` });
      }

      const newInvoiceDetail = new InvoiceDetail({
        Invoice_Id: newInvoiceMaster._id, 
        Product_Id: item.productId,  
        Rate: item.rate,
        Unit: item.unit,
        Qty: item.qty,
        Disc_Percentage: item.discount,
        NetAmount: item.netAmount,
        TotalAmount: item.totalAmount
      });
      console.log('4', newInvoiceDetail);
      await newInvoiceDetail.save();
    }

    return res.status(200).json({ message: 'Invoice saved successfully', invoiceMaster });
  } catch (error) {
    console.error('Error saving invoice:', error);
    return res.status(500).json({ error: 'An error occurred while saving the invoice' });
  }
});
module.exports = router;
