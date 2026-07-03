const asyncHandler = require('../utils/asyncHandler');
exports.getProducts = asyncHandler(async (req, res) => { res.json({ message: "getProducts stub" }); });
exports.getProductById = asyncHandler(async (req, res) => { res.json({ message: "getProductById stub" }); });
exports.createProduct = asyncHandler(async (req, res) => { res.json({ message: "createProduct stub" }); });
exports.updateProduct = asyncHandler(async (req, res) => { res.json({ message: "updateProduct stub" }); });
exports.deleteProduct = asyncHandler(async (req, res) => { res.json({ message: "deleteProduct stub" }); });
