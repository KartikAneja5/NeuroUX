const axios = require('axios');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
require('dotenv').config();

const RECOMMENDER_URL = process.env.RECOMMENDER_URL || 'http://localhost:8000';

exports.getRecommendations = asyncHandler(async (req, res) => {
  const { id } = req.params; // Current product ID
  const userId = req.query.user_id || '';
  const limit = parseInt(req.query.limit || 6);

  try {
    // Call Django recommender API
    const response = await axios.get(`${RECOMMENDER_URL}/api/recommend/${id}/`, {
      params: { user_id: userId, top_n: limit }
    });

    const recommendations = response.data.recommendations || [];
    const recommendedIds = recommendations.map(r => r.productId);

    // Fetch product details from DB
    const products = await Product.find({ _id: { $in: recommendedIds }, isActive: true });

    // Order products to match the scores list returned by Django
    const sortedProducts = recommendedIds
      .map(recId => products.find(p => p._id.toString() === recId))
      .filter(Boolean);

    res.json(sortedProducts);
  } catch (error) {
    console.error('Error querying Django recommender:', error.message);

    // Resilient fallback: Recommend other products in the same category
    const currentProduct = await Product.findById(id);
    const categoryQuery = currentProduct ? { category: currentProduct.category } : {};

    const fallbackProducts = await Product.find({
      _id: { $ne: id },
      ...categoryQuery,
      isActive: true
    }).limit(limit);

    res.json(fallbackProducts);
  }
});
