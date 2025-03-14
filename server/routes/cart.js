// const express = require('express');
// const router = express.Router();
// const Product = require('../models/products'); // Adjust the path as necessary

// // Endpoint to get product details by productId

// router.post('/:productId', async (req, res) => {
//     const { productId } = req.params;

//     try {
//         // Fetch the product details from the database
//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         // Return the full product information
//         res.json(product);
//     } catch (error) {
//         console.error("Error fetching product details:", error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// router.get('/', async (req, res) => {
//     try {
//         const cartItems = await Cart.find(); // Fetch all cart items
//         const productIds = cartItems.map(item => item.productId);
//         const products = await Product.find({ _id: { $in: productIds } }); // Fetch product details

//         // Map product details to cart items
//         const detailedCartItems = cartItems.map(cartItem => {
//             const product = products.find(prod => prod._id.toString() === cartItem.productId.toString());
//             return {
//                 ...product._doc, // Spread product details
//                 quantity: cartItem.quantity // Include cart-specific info like quantity
//             };
//         });

//         res.json(detailedCartItems);
//     } catch (error) {
//         console.error('Error fetching cart items:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const mongoose = require('mongoose');
const Product = require("../models/products"); // Adjust the path as necessary

// Endpoint to get product details by productId

router.post("/", async (req, res) => {
  const { mail, prodId } = req.body;
  // console.log(req.body);
  if (!prodId || !mail) {
    return res.status(400).send("Email and product ID are required");
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(prodId)) {
      return res.status(400).send("Invalid product ID");
    }

    // Find the user by email
    const user = await User.findOne({ email: mail });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the scheme exists
    const prod = await Product.findById(prodId);
    if (!prod) {
      return res.status(404).send("Product not found");
    }

      user.cart.push(prodId);
      await user.save();
      res.send({
        message: "Product added to cart successfully",
        cart: user.cart,
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    // Fetch the product details from the database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the full product information
    res.json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const cartItems = await Cart.find(); // Fetch all cart items
    const productIds = cartItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }); // Fetch product details

    // Map product details to cart items
    const detailedCartItems = cartItems.map((cartItem) => {
      const product = products.find(
        (prod) => prod._id.toString() === cartItem.productId.toString()
      );
      return {
        ...product._doc, // Spread product details
        quantity: cartItem.quantity, // Include cart-specific info like quantity
      };
    });

    res.json(detailedCartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
