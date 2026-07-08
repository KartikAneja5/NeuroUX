const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Interaction = require('../models/Interaction');
const asyncHandler = require('../utils/asyncHandler');

exports.checkout = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
  
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty." });
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.productId;
    if (!product || !product.isActive) {
      return res.status(400).json({ message: `Product '${product ? product.name : 'Unknown'}' is no longer active or available.` });
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    });
  }

  // Create order
  const order = new Order({
    userId: req.user.id,
    items: orderItems,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    status: 'completed' // Autocomplete checkout for mock e-commerce flow
  });

  await order.save();

  // Log "purchase" interaction (weight: 5) for recommendation model data
  for (const item of orderItems) {
    const interaction = new Interaction({
      userId: req.user.id,
      productId: item.productId,
      type: 'purchase',
      weight: 5
    });
    await interaction.save();
  }

  // Clear user's cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});
