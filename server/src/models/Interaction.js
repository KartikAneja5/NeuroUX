const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionToken: { type: String, default: '' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['view', 'cart', 'purchase'], required: true },
  weight: { type: Number, required: true }, // view=1, cart=3, purchase=5
  source: { type: String, enum: ['browse', 'recommendation', 'checkout'], default: 'browse' },
  timestamp: { type: Date, default: Date.now }
});

// Performance indexes for PyMongo queries and recommendation engine feature retrieval
interactionSchema.index({ userId: 1 });
interactionSchema.index({ productId: 1 });
interactionSchema.index({ sessionToken: 1 });
interactionSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Interaction', interactionSchema);

