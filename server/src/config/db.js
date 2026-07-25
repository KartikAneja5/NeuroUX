const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/NeuroUX';

  try {
    const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Primary MongoDB connection failed (${error.message}). Attempting fallback to local MongoDB...`);
    try {
      const conn = await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 5000 });
      console.log(`Local MongoDB Connected: ${conn.connection.host}`);
    } catch (fallbackError) {
      console.error(`Local MongoDB fallback connection error: ${fallbackError.message}`);
      throw fallbackError;
    }
  }
};

module.exports = connectDB;
