const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const bidRoutes = require('./routes/bidRoutes');
const binRoutes = require('./routes/binRoutes');

dotenv.config();

const app = express(); 

// connect to MongoDB
connectDB(process.env.MONGODB_URI); 

// middlewares
app.use(morgan('dev')); // log HTTP traffic in dev
app.use(cors());
// app.use(cors({ origin: process.env.CLIENT_URL || "https://localhost",
//    methods: ["GET", "POST", "PUT", "DELETE"],
//  })); // allow client origin
app.use(express.json()); //  parse JSON body payloads

//routes
app.use('/api/auth', authRoutes); 
app.use('/api/listings', listingRoutes); 
app.use('/api/bids', bidRoutes); 
app.use('/api/bins', binRoutes);
// add other route mounts (users, dashboard) as needed

app.get('/api/ping', (req, res) => { 
  res.status(200).json({ message: 'API is healthy ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

