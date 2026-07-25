const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

const reviewController = require('../controllers/reviewController');

// Public catalog routes
router.get('/', productController.getProducts);
router.get('/homepage-layout', recommendationController.getHomepageLayout);
router.get('/site-insights', recommendationController.getSiteInsights);
router.get('/:id/reviews', reviewController.getProductReviews);
router.post('/:id/reviews', authMiddleware, reviewController.addOrUpdateReview);
router.get('/:id', productController.getProductById);

// Admin-only endpoints with multi-file uploads
const uploadFields = upload.fields([
  { name: 'preview', maxCount: 1 },
  { name: 'code', maxCount: 1 }
]);

router.post('/', authMiddleware, adminMiddleware, uploadFields, productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, uploadFields, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

router.get('/:id/recommendations', recommendationController.getRecommendations);

module.exports = router;
