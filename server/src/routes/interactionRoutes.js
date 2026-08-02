const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const interactionController = require('../controllers/interactionController');
const validateRequest = require('../middleware/validateRequest');
const { interactionLimiter } = require('../middleware/rateLimiter');

const ALLOWED_ACTIONS = ['view', 'hover', 'search', 'filter', 'cart_add', 'purchase', 'wishlist'];

router.post(
  '/',
  interactionLimiter,
  [
    body('productId')
      .notEmpty()
      .withMessage('productId is required')
      .isMongoId()
      .withMessage('productId must be a valid MongoDB ObjectId'),
    body('type')
      .optional()
      .isIn(ALLOWED_ACTIONS)
      .withMessage(`type must be one of: ${ALLOWED_ACTIONS.join(', ')}`),
    body('weight')
      .optional()
      .isFloat({ min: 0.0, max: 10.0 })
      .withMessage('weight must be a float between 0.0 and 10.0')
  ],
  validateRequest,
  interactionController.logInteraction
);

router.post(
  '/behavior',
  interactionLimiter,
  [
    body('productId')
      .optional()
      .isMongoId()
      .withMessage('productId must be a valid MongoDB ObjectId'),
    body('action')
      .notEmpty()
      .withMessage('action is required')
      .isIn(ALLOWED_ACTIONS)
      .withMessage(`action must be one of: ${ALLOWED_ACTIONS.join(', ')}`),
    body('weight')
      .optional()
      .isFloat({ min: 0.0, max: 10.0 })
      .withMessage('weight must be a float between 0.0 and 10.0')
  ],
  validateRequest,
  interactionController.logBehavior
);

module.exports = router;

