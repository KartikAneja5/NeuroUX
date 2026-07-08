const Interaction = require('../models/Interaction');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.logInteraction = asyncHandler(async (req, res) => {
  const { productId, type } = req.body;

  if (!productId || !type) {
    return res.status(400).json({ message: "Product ID and interaction type are required." });
  }

  // Verify product exists and is active
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    return res.status(404).json({ message: "Product not found or inactive." });
  }

  // Set interaction weights
  let weight = 1; // default view
  if (type === 'view') {
    weight = 1;
  } else if (type === 'cart') {
    weight = 3;
  } else if (type === 'purchase') {
    weight = 5;
  } else {
    return res.status(400).json({ message: "Invalid interaction type. Must be 'view', 'cart', or 'purchase'." });
  }

  // Extract optional user authorization
  let userId = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecretkey');
      userId = decoded.id;
    } catch (err) {
      // In case of invalid or expired token, proceed as guest/anonymous log
    }
  }

  const interaction = new Interaction({
    userId,
    productId,
    type,
    weight
  });

  await interaction.save();
  res.status(201).json(interaction);
});
