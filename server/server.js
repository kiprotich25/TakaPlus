require('dotenv').config(); // (1)
const express = require('express'); // (2)
const cors = require('cors'); // (3)
const morgan = require('morgan'); // (4)
const connectDB = require('./config/db'); // (5)

const app = express(); // (6)

// connect to MongoDB
connectDB(process.env.MONGODB_URI); // (7)

// middlewares
app.use(morgan('dev')); // (8) log HTTP traffic in dev
app.use(cors({ origin: process.env.CLIENT_URL })); // (9) allow client origin
app.use(express.json()); // (10) parse JSON body payloads

// routes
// app.use('/api/auth', require('./routes/authRoutes')); // (11)
// app.use('/api/listings', require('./routes/listingRoutes')); // (12)
// app.use('/api/bids', require('./routes/bidRoutes')); // (13)
// // add other route mounts (users, dashboard) as needed

app.get('/api/ping', (req, res) => { // (14)
  res.status(200).json({ message: 'API is healthy ✅' });
});

const PORT = process.env.PORT || 5000; // (15)
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`)); // (16)

