const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

// Add or Update a Review for a Product
exports.addOrUpdateReview = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { rating, comment } = req.body;
  const userId = req.user?.id || req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required to submit a review." });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  // Check if user has a completed order containing this product
  const completedOrder = await Order.findOne({
    userId,
    status: 'completed',
    'items.productId': productId
  });
  const isVerifiedPurchase = Boolean(completedOrder);

  // Upsert review (update if already exists, otherwise create)
  let review = await Review.findOne({ productId, userId });
  if (review) {
    review.rating = Number(rating);
    review.comment = comment || review.comment;
    review.isVerifiedPurchase = isVerifiedPurchase;
    await review.save();
  } else {
    review = await Review.create({
      userId,
      productId,
      rating: Number(rating),
      comment: comment || '',
      isVerifiedPurchase
    });
  }

  // Recalculate average rating & numReviews for the Product
  const stats = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$productId',
        numReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    product.numReviews = stats[0].numReviews;
    product.averageRating = Math.round(stats[0].averageRating * 10) / 10;
  } else {
    product.numReviews = 0;
    product.averageRating = 5.0;
  }
  await product.save();

  res.status(200).json({
    message: 'Review saved successfully!',
    review,
    averageRating: product.averageRating,
    numReviews: product.numReviews
  });
});

// Get all reviews for a specific Product
exports.getProductReviews = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const reviews = await Review.find({ productId })
    .populate('userId', 'name role')
    .sort({ createdAt: -1 });

  const product = await Product.findById(productId).select('averageRating numReviews');

  res.status(200).json({
    averageRating: product?.averageRating || 5.0,
    numReviews: product?.numReviews || 0,
    reviews
  });
});
