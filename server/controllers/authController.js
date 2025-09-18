const User = require('../models/User'); // (1)
const bcrypt = require('bcrypt'); // (2)
const jwt = require('jsonwebtoken'); // (3)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'; // (4)
const SALT_ROUNDS = 10; // (5)

exports.register = async (req, res, next) => { // (6)
  try {
    const { name, email, password, role } = req.body; // (7)
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' }); // (8)

    const exists = await User.findOne({ email }); // (9)
    if (exists) return res.status(409).json({ error: 'Email already registered' }); // (10)

    const hash = await bcrypt.hash(password, SALT_ROUNDS); // (11)
    const user = await User.create({ name, email, passwordHash: hash, role }); // (12)

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' }); // (13)
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }); // (14)
  } catch (err) {
    next(err); // (15)
  }
};

exports.login = async (req, res, next) => { // (16)
  try {
    const { email, password } = req.body; // (17)
    const user = await User.findOne({ email }); // (18)
    if (!user) return res.status(401).json({ error: 'Invalid credentials' }); // (19)
    const ok = await user.verifyPassword(password); // (20)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' }); // (21)
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' }); // (22)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }); // (23)
  } catch (err) {
    next(err);
  }
};
