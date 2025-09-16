const express = require('express'); // (1)
const cors = require('cors'); // (2)
const morgan = require('morgan'); // (3)

// Routes
const listingsRouter = require('./routes/listings'); // (4)
const authRouter = require('./routes/auth'); // (5) (optional, create later)

const app = express(); // (6)

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || '*' })); // (7)
app.use(express.json()); // (8)
app.use(morgan('dev')); // (9)

// Health check
app.get('/health', (req, res) => { // (10)
  res.json({ status: 'ok' });
});

// Mount API routes
app.use('/api/listings', listingsRouter); // (11)
// app.use('/api/auth', authRouter); // (12) // uncomment when auth route exists

// Global error handler (simple)
app.use((err, req, res, next) => { // (13)
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app; // (14)
