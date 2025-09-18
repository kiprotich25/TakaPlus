const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },     // (1)
  material: { type: String, required: true },  // (2)
  quantity: { type: Number, required: true },  // (3)
  unit: { type: String, default: 'kg' },       // (4)
  lat: { type: Number },                       // (5)
  lng: { type: Number },                       // (6)
  photoUrl: { type: String },                  // (7)
  status: { type: String, enum: ['open','accepted','collected','closed'], default: 'open' }, // (8)
  co2Saved: { type: Number, default: 0 },      // (9)
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // (10)
  createdAt: { type: Date, default: Date.now } // (11)
});

module.exports = mongoose.model('Listing', ListingSchema);
