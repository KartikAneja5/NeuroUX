const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const { authLimiter } = require('../middleware/rateLimiter');

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  validateRequest,
  authController.register
);

router.post('/verify/:token', authController.verifyEmail);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please include a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  authController.login
);

router.post(
  '/forgot-password',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please include a valid email address')
  ],
  validateRequest,
  authController.forgotPassword
);

router.post(
  '/reset-password/:token',
  authLimiter,
  [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  validateRequest,
  authController.resetPassword
);

module.exports = router;

