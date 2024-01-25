// Your existing route file

const express = require("express");
const router = express.Router();
const Product = require("../models/product.model"); // Adjust the path based on your project structure



//addproduct api 
router.post("/addproduct", async (req, res) => {
  try {
    const { id, name, image, category, new_price, old_price } = req.body;

    // Create a new instance of the Product model
    const product = new Product({
      id,
      name,
      image,
      category,
      new_price,
      old_price,
    });
    console.log(product);
    // Save the product to the database
    await product.save();

    res
      .status(201)
      .json({ message: "Product added successfully", name:req.body.name });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
