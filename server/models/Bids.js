 const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }, // (1)
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },      // (2)
  amount: { type: Number },    // (3) price offered (total or per unit)
  message: { type: String },   // (4)
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }, // (5)
  createdAt: { type: Date, default: Date.now } // (6)
});

module.exports = mongoose.model('Bid', BidSchema);
