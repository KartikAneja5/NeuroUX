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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
