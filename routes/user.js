const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("../models/user.model"); // Adjust the path based on your project structure

//creating endpoint for registering  the user


router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: "User with this email already exists",
      });
    }

    // Hash the password
    const saltRounds = 10; // You may adjust this according to your needs
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with hashed password
    const cart = Array(300).fill(0); // Improved way to create an array
    const user = new Users({
      name: username,
      email,
      password: hashedPassword,
      cartData: cart,
    });

    // Save the user to the database
    await user.save();

    // Create a JWT token
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET || "secret_ecom");

    // Return success response
    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//login

router.post('/login', async (req, res) => {
    try {
        // Find the user by email
        let user = await Users.findOne({ email: req.body.email });

        if (user) {
            // Compare the provided password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);

            if (passwordMatch) {
                const data = {
                    user: {
                        id: user.id,
                    },
                };

                const token = jwt.sign(data, 'secret_ecom');
                res.json({ success: true, token  , user});
            } else {
                res.json({
                    success: false,
                    errors: 'Wrong Password',

                });
            }
        } else {
            res.json({
                success: false,
                errors: "User with email doesn't exist",
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

// "username" :"shreyu",
// "password":"123456789",
// "email":"shreya@gmail.com",
