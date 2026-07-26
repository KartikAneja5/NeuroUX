const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

const connectDB = async () => {
  // Ensure DNS SRV resolution succeeds on Windows/networks with restrictive local DNS
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (dnsErr) {
    console.warn("Custom DNS setServers failed:", dnsErr.message);
  }

  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/NeuroUX';
  const fallbackUri = 'mongodb://127.0.0.1:27017/NeuroUX';

  try {
    const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 8000 });
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
