const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-order', authMiddleware, paymentController.createRazorpayOrder);
router.post('/verify', authMiddleware, paymentController.verifyRazorpayPayment);

module.exports = router;
