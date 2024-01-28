const Users = require("../models/user.model"); // Adjust the path based on your project structure
const Product = require("../models/product.model"); // Adjust the path based on your project structure
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");


//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ errors: "Please Please authenticate using valid token" });
    }
  }
};

//creating endpoint for adding products in cartdata

router.post("/addtocart", fetchUser, async (req, res) => {
    console.log("Added" ,req.body.itemId);

  let userData = await Users.findOne({_id:req.user.id});

  userData.cartData[req.body.itemId] += 1;
  await Users.findByIdAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send({message:"Added to Cart"});
});


//creating endpoint to remove data from cart
router.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("Removed" ,req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id});
  if(userData.cartData[req.body.itemId] > 0){
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findByIdAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send({message:"Removed from Cart"});
});


module.exports = router;

