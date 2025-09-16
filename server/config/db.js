const mongoose = require('mongoose'); // (1)

module.exports = async function connectDB(uri) { // (2)
  if (!uri) throw new Error('MONGODB_URI not set'); // (3)
  try {
    await mongoose.connect(uri, { // (4)
      
    });
    console.log('MongoDB connected successfully'); // (5)
  } catch (err) {
    console.error('MongoDB connection error', err); // (6)
    throw err; // (7)
  }
};
