const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateToken = require('../utils/generateToken');
const emailService = require('../services/emailService');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields (name, email, password) are required." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "A user with this email address already exists." });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create user
  const user = new User({
    name,
    email,
    passwordHash,
    role: role === 'admin' ? 'admin' : 'customer', // default to customer unless explicitly set to admin
    isVerified: false,
    verificationToken
  });

  await user.save();

  // Send verification email
  try {
    await emailService.sendVerificationEmail(email, verificationToken);
  } catch (err) {
    console.error("Email sending failed during registration:", err);
  }

  res.status(201).json({
    message: "Registration successful. Please check your email to verify your account."
  });
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).json({ message: "Invalid or expired verification token." });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({ message: "Your email has been successfully verified! You can now log in." });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  if (!user.isVerified) {
    return res.status(400).json({ message: "Please verify your email address before logging in." });
  }

  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email address is required." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Return 200 for security reasons (prevents user enumeration)
    return res.json({ message: "If that email address exists in our database, we have sent a password reset link to it." });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour validity

  await user.save();

  try {
    await emailService.sendResetPasswordEmail(email, resetToken);
  } catch (err) {
    console.error("Email sending failed during forgotPassword:", err);
  }

  res.json({ message: "If that email address exists in our database, we have sent a password reset link to it." });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "New password is required." });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Password reset token is invalid or has expired." });
  }

  // Hash new password and clear token fields
  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Your password has been successfully reset! You can now log in." });
});
