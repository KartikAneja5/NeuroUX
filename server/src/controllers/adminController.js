const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
  res.json(users);
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

exports.getAnalytics = asyncHandler(async (req, res) => {
  // Total Revenue
  const revenueResult = await Order.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  // Total Sales (Order count)
  const salesCount = await Order.countDocuments({ status: 'completed' });

  // Active Customers
  const activeCustomers = await User.countDocuments({ role: 'customer' });

  // Catalog Size
  const catalogSize = await Product.countDocuments({ isActive: true });

  // Recent Orders
  const recentOrders = await Order.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    revenue,
    salesCount,
    activeCustomers,
    catalogSize,
    recentOrders
  });
});
