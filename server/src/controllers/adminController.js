const asyncHandler = require('../utils/asyncHandler');
exports.getUsers = asyncHandler(async (req, res) => { res.json({ message: "getUsers stub" }); });
exports.getOrders = asyncHandler(async (req, res) => { res.json({ message: "getOrders stub" }); });
exports.getAnalytics = asyncHandler(async (req, res) => { res.json({ message: "getAnalytics stub" }); });
