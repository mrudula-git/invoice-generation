const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
console.log(mongoURI,"url")

app.use(cors());
app.use(express.json());

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log("err",err));

const productRoutes = require("./routes/products");
const invoiceRoutes = require("./routes/invoices");

app.use("/api/products", productRoutes);
app.use("/api/saveInvoice", invoiceRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });