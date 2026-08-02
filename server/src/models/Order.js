const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  abVariant: { type: String, enum: ['variant_A', 'variant_B'], default: 'variant_A' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
}, { timestamps: true });

// Performance index for /api/orders/myorders lookup
orderSchema.index({ userId: 1 });
orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);

