const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    const { Product_Name, Rate, Unit } = req.body;

    if (!Product_Name || !Rate || !Unit) {
        return res.status(400).json({ message: "Please provide Product_Name, Rate, and Unit." });
    }

    try {
        const newProduct = new Product({
            Product_Name,
            Rate,
            Unit,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({ message: "Error creating product." });
    }
});

module.exports = router;