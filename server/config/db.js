const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobin_dashboard', {
      serverSelectionTimeoutMS: 2000 // Short timeout for local testing
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Failed: ${error.message}`);
    console.warn(`🚀 Running in Mock API Mode for local testing.`);
    return false;
  }
};


module.exports = connectDB;
