const mongoose = require('mongoose'); // (1)
const bcrypt = require('bcrypt'); // (2)

const UserSchema = new mongoose.Schema({ // (3)
  name: { type: String, required: true }, // (4)
  email: { type: String, required: true, unique: true }, // (5)
  password: { type: String, required: true }, // (6)
  role: { type: String, enum: ['user','buyer','admin'], default: 'user' }, // (7)
  createdAt: { type: Date, default: Date.now } // (8)
});

// instance method to verify password
UserSchema.methods.verifyPassword = function(password) { // (9)
  return bcrypt.compare(password, this.passwordHash); // (10)
};

module.exports = mongoose.model('User', UserSchema); // (11)
