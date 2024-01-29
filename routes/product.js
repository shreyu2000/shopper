// Your existing route file
const express = require("express");
const router = express.Router();
const Product = require("../models/product.model"); // Adjust the path based on your project structure

//addproduct api
router.post("/addproduct", async (req, res) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id + 1;
    } else {
      id = 1;
    }

    const { name, image, category, new_price, old_price } = req.body;

    // Create a new instance of the Product model
    const product = new Product({
      id: id,
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
      .json({
        success: true,
        message: "Product added successfully",
        name: req.body.name,
      });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//creating api for deleting products

// router.post("/removeproduct" , async(req,res)=>{
//     await Product.findOneAndDelete({id:req.body.id});
//     console.log("Removed");
//     res.json({
//         success:true,
//         name:req.body.name
//     })
// })

router.post("/removeproduct", async (req, res) => {
  try {
    const { id } = req.body;

    // Validate if the ID is provided
    if (!id) {
      return res.status(400).json({ error: "Bad Request - Missing ID" });
    }

    // Use findOneAndDelete to find the product by its id and remove it
    const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log(`Product "${deletedProduct.name}" removed successfully`);
    res.json({
      success: true,
      name: deletedProduct.name,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//creating api for getting all products

router.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All products fetched");
  res.send(products);
});

//creating endpoint for new collection data

router.get("/newcollections", async (req, res) => {
  let products = await Product.find({});

  let newcollection = products.slice(1).slice(-8);
  console.log("New Collection Fetched");
  res.send(newcollection);
});

//endpoint for popular in women

router.get("/pouplarinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });

  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
});




module.exports = router;
