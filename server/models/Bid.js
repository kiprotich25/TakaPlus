 // server/models/Bid.js
 const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }, 
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },      
  amount: { type: Number },    
  message: { type: String },   
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', BidSchema);
