const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// All admin routes require a valid JWT AND admin role
router.use(authMiddleware, adminMiddleware);

router.get('/users', adminController.getUsers);
router.get('/orders', adminController.getOrders);
router.get('/analytics', adminController.getAnalytics);
router.get('/analytics/diagnostic', adminController.getDiagnosticAnalytics);
module.exports = router;
