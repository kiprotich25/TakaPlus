const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },     
  material: { type: String, required: true },  
  quantity: { type: Number, required: true },  
  unit: { type: String, default: 'kg' },       
  lat: { type: Number },                       
  lng: { type: Number },                       
  photoUrl: { type: String },                  
  status: { type: String, enum: ['open','accepted','collected','closed'], default: 'open' }, 
  co2Saved: { type: Number, default: 0 },     
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);
