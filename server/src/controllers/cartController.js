const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [] });
    await cart.save();
  }
  res.json(cart);
});

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required." });
  }

  // Verify product exists and is active
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    return res.status(404).json({ message: "Product not found or inactive." });
  }

  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += parseInt(quantity);
  } else {
    cart.items.push({ productId, quantity: parseInt(quantity) });
  }

  await cart.save();
  const populatedCart = await cart.populate('items.productId');
  res.json(populatedCart);
});

exports.updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ message: "Product ID and quantity are required." });
  }

  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found." });
  }

  const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (itemIndex > -1) {
    const parsedQty = parseInt(quantity);
    if (parsedQty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = parsedQty;
    }
    await cart.save();
    const populatedCart = await cart.populate('items.productId');
    return res.json(populatedCart);
  }

  res.status(404).json({ message: "Item not found in cart." });
});

exports.removeFromCart = asyncHandler(async (req, res) => {
  const { id } = req.params; // this is the productId to remove

  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found." });
  }

  cart.items = cart.items.filter(item => item.productId.toString() !== id);
  await cart.save();
  
  const populatedCart = await cart.populate('items.productId');
  res.json(populatedCart);
});
