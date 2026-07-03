const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes stubs mounting
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/interactions', require('./routes/interactionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: "Welcome to UI/UX Component Marketplace API" });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
