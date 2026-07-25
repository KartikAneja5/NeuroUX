const Interaction = require('../models/Interaction');
const BehavioralSignal = require('../models/BehavioralSignal');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Discrete interaction logger (view=1, cart=3, purchase=5) - Untouched & fully intact
exports.logInteraction = asyncHandler(async (req, res) => {
  const { productId, type, source, sessionToken } = req.body;

  if (!productId || !type) {
    return res.status(400).json({ message: "Product ID and interaction type are required." });
  }

  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    return res.status(404).json({ message: "Product not found or inactive." });
  }

  let weight = 1;
  if (type === 'view') {
    weight = 1;
  } else if (type === 'cart') {
    weight = 3;
  } else if (type === 'purchase') {
    weight = 5;
  } else {
    return res.status(400).json({ message: "Invalid interaction type. Must be 'view', 'cart', or 'purchase'." });
  }

  let userId = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecretkey');
      userId = decoded.id;
    } catch (err) {
      // Guest logger fallback
    }
  }

  const validSource = ['browse', 'recommendation'].includes(source) ? source : 'browse';

  const interaction = new Interaction({
    userId,
    sessionToken: sessionToken || '',
    productId,
    type,
    weight,
    source: validSource
  });

  await interaction.save();
  res.status(201).json(interaction);
});

// Continuous behavioral signal batch logger (Phase 1)
exports.logBehavior = asyncHandler(async (req, res) => {
  const { sessionToken, categoryDwellTime, scrollDepth, filterClicks } = req.body;

  if (!sessionToken) {
    return res.status(400).json({ message: "Session token is required for behavioral tracking." });
  }

  let userId = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecretkey');
      userId = decoded.id;
    } catch (err) {
      // Guest logger fallback
    }
  }

  const signal = new BehavioralSignal({
    userId,
    sessionToken,
    categoryDwellTime: categoryDwellTime || {},
    scrollDepth: Math.min(100, Math.max(0, scrollDepth || 0)),
    filterClicks: Array.isArray(filterClicks) ? filterClicks : []
  });

  await signal.save();
  res.status(201).json({ message: "Behavioral signals logged successfully.", signalId: signal._id });
});
