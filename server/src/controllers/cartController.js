const asyncHandler = require('../utils/asyncHandler');
exports.getCart = asyncHandler(async (req, res) => { res.json({ message: "getCart stub" }); });
exports.addToCart = asyncHandler(async (req, res) => { res.json({ message: "addToCart stub" }); });
exports.updateCartItem = asyncHandler(async (req, res) => { res.json({ message: "updateCartItem stub" }); });
exports.removeFromCart = asyncHandler(async (req, res) => { res.json({ message: "removeFromCart stub" }); });
