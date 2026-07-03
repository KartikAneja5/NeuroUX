const asyncHandler = require('../utils/asyncHandler');
exports.checkout = asyncHandler(async (req, res) => { res.json({ message: "checkout stub" }); });
exports.getMyOrders = asyncHandler(async (req, res) => { res.json({ message: "getMyOrders stub" }); });
