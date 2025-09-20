const mongoose = require('mongoose');

const BinSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String },
  binType: { 
    type: String, 
    enum: ['recycling', 'compost', 'general', 'hazardous', 'electronic'],
    default: 'recycling' 
  },
  capacity: { type: Number }, // in kg or liters
  currentFill: { type: Number, default: 0 }, // current fill level
  status: { 
    type: String, 
    enum: ['active', 'maintenance', 'full', 'inactive'],
    default: 'active' 
  },
  lastEmptied: { type: Date },
  nextMaintenance: { type: Date },
  photoUrl: { type: String },
  operatingHours: {
    open: { type: String, default: '06:00' },
    close: { type: String, default: '22:00' }
  },
  acceptedMaterials: [{ type: String }], // array of material types accepted
  contactInfo: {
    phone: { type: String },
    email: { type: String }
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
BinSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Bin', BinSchema);
