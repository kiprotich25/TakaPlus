// (1)
require('dotenv').config(); 
const app = require('./app'); // (2)
const connectDB = require('./config/db'); // (3)

const PORT = process.env.PORT || 5000; // (4)

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI); // (5)
    app.listen(PORT, () => { // (6)
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err); // (7)
    process.exit(1); // (8)
  }
}

start(); // (9)
