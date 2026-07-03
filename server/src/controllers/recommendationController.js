const asyncHandler = require('../utils/asyncHandler');
exports.getRecommendations = asyncHandler(async (req, res) => { res.json({ message: "getRecommendations stub" }); });
