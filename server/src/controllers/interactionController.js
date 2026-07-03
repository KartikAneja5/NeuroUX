const asyncHandler = require('../utils/asyncHandler');
exports.logInteraction = asyncHandler(async (req, res) => { res.json({ message: "logInteraction stub" }); });
