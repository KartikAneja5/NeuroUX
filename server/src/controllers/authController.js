const asyncHandler = require('../utils/asyncHandler');
exports.register = asyncHandler(async (req, res) => { res.json({ message: "register stub" }); });
exports.verifyEmail = asyncHandler(async (req, res) => { res.json({ message: "verifyEmail stub" }); });
exports.login = asyncHandler(async (req, res) => { res.json({ message: "login stub" }); });
exports.forgotPassword = asyncHandler(async (req, res) => { res.json({ message: "forgotPassword stub" }); });
exports.resetPassword = asyncHandler(async (req, res) => { res.json({ message: "resetPassword stub" }); });
