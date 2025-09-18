const jwt = require('jsonwebtoken'); // (1)
const User = require('../models/User'); // (2)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'; // (3)

module.exports = async function auth(req, res, next) { // (4)
  try {
    const authHeader = req.headers.authorization; // (5)
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' }); // (6)
    const token = authHeader.split(' ')[1]; // (7)
    const payload = jwt.verify(token, JWT_SECRET); // (8)
    const user = await User.findById(payload.userId).select('-passwordHash'); // (9)
    if (!user) return res.status(401).json({ error: 'Invalid token user' }); // (10)
    req.user = user; // (11) attach user doc to request
    next(); // (12)
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' }); // (13)
  }
};
