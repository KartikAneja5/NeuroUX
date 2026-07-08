const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
require('dotenv').config();

const SERVER_BASE_URL = process.env.SERVER_BASE_URL || 'http://localhost:5000';

exports.getProducts = asyncHandler(async (req, res) => {
  const { search, category, framework, page = 1, limit = 12 } = req.query;

  let queryObj = { isActive: true };

  if (category) {
    queryObj.category = category;
  }

  if (framework) {
    queryObj.framework = framework;
  }

  if (search) {
    queryObj.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const total = await Product.countDocuments(queryObj);
  const products = await Product.find(queryObj)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit);

  res.json({
    products,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit)
    }
  });
});

exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, isActive: true });
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  res.json(product);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, tags, description, livePreviewUrl, framework } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ message: "Name, category, and price are required." });
  }

  if (!req.files || !req.files.preview || !req.files.code) {
    return res.status(400).json({ message: "Both preview image and code bundle files are required." });
  }

  let parsedTags = [];
  if (tags) {
    try {
      parsedTags = JSON.parse(tags);
    } catch (e) {
      parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }
  }

  const previewImageUrl = `${SERVER_BASE_URL}/uploads/previews/${req.files.preview[0].filename}`;
  const codeFileUrl = `${SERVER_BASE_URL}/uploads/code/${req.files.code[0].filename}`;

  const product = new Product({
    name,
    category,
    price: parseFloat(price),
    tags: parsedTags,
    description,
    livePreviewUrl,
    framework: framework || 'react',
    previewImageUrl,
    codeFileUrl,
    createdBy: req.user.id
  });

  await product.save();
  res.status(201).json(product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, price, tags, description, livePreviewUrl, framework } = req.body;

  const product = await Product.findOne({ _id: id, isActive: true });
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  if (name) product.name = name;
  if (category) product.category = category;
  if (price) product.price = parseFloat(price);
  if (description) product.description = description;
  if (livePreviewUrl) product.livePreviewUrl = livePreviewUrl;
  if (framework) product.framework = framework;

  if (tags) {
    try {
      product.tags = JSON.parse(tags);
    } catch (e) {
      product.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }
  }

  if (req.files) {
    if (req.files.preview) {
      product.previewImageUrl = `${SERVER_BASE_URL}/uploads/previews/${req.files.preview[0].filename}`;
    }
    if (req.files.code) {
      product.codeFileUrl = `${SERVER_BASE_URL}/uploads/code/${req.files.code[0].filename}`;
    }
  }

  await product.save();
  res.json(product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, isActive: true });
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  // Soft delete product so recommendation histories remain valid
  product.isActive = false;
  await product.save();

  res.json({ message: "Product successfully deleted." });
});
