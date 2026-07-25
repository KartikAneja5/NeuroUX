const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Interaction = require('../models/Interaction');
const asyncHandler = require('../utils/asyncHandler');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SHKdpANR8mxkAu',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'S1q1gKnNx9ETYChqIsV7Rbag'
});

// Create Razorpay Order
exports.createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Valid amount is required." });
  }

  // Razorpay expects amount in paise (1 INR = 100 paise)
  const options = {
    amount: Math.round(amount * 100),
    currency,
    receipt: `receipt_${Date.now()}`
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.json({
    id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_SHKdpANR8mxkAu'
  });
});

// Verify Razorpay Payment Signature
exports.verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  const userId = req.user?.id || req.user?._id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: "Missing Razorpay verification parameters." });
  }

  // Generate HMAC SHA256 expected signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'S1q1gKnNx9ETYChqIsV7Rbag')
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature verification failed." });
  }

  // Signature valid! Update Mongo Order if orderId provided
  let order;
  if (orderId) {
    order = await Order.findById(orderId);
  } else {
    // Find latest pending order for this user
    order = await Order.findOne({ userId, status: 'pending' }).sort({ createdAt: -1 });
  }

  if (order) {
    order.status = 'completed';
    order.paymentMethod = 'razorpay';
    order.paymentId = razorpay_payment_id;
    await order.save();

    // Log purchase interactions for AI Recommender engine
    for (const item of order.items) {
      await Interaction.create({
        userId,
        productId: item.productId,
        type: 'purchase',
        weight: 5.0,
        source: 'checkout'
      });
    }
  }

  // Clear user cart
  await Cart.findOneAndDelete({ userId });

  res.json({
    success: true,
    message: "Payment verified successfully!",
    orderId: order ? order._id : orderId
  });
});
