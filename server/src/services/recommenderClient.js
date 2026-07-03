const axios = require('axios');
const djangoUrl = process.env.DJANGO_BASE_URL || 'http://localhost:8000';
exports.getRecommendations = async (productId, userId = '') => {
  const response = await axios.get(`${djangoUrl}/api/recommend/${productId}/`, {
    params: { user_id: userId }
  });
  return response.data;
};
