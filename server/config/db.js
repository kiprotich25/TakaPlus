const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI not set');
  try {
    await mongoose.connect(uri, {});
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error', err);
    throw err;
  }
}

module.exports = connectDB;
