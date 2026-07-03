const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
router.get('/users', adminController.getUsers);
router.get('/orders', adminController.getOrders);
router.get('/analytics', adminController.getAnalytics);
module.exports = router;
