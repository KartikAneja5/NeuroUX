const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['view', 'cart', 'purchase'], required: true },
  weight: { type: Number, required: true }, // view=1, cart=3, purchase=5
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interaction', interactionSchema);
