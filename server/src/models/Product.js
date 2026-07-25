const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  description: { type: String },
  price: { type: Number, required: true },
  previewImageUrl: { type: String },
  livePreviewUrl: { type: String },
  codeFileUrl: { type: String },
  code: { type: String },
  framework: { type: String, default: 'react' },
  averageRating: { type: Number, default: 5.0 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Performance indexes for fast category filtering, tag search, and regex queries
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
