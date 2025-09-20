const express = require('express');
const router = express.Router();
const { 
  createBin, 
  getBins, 
  getBinById, 
  updateBin, 
  deleteBin, 
  getNearbyBins 
} = require('../controllers/binsController');
const auth = require('../middleware/auth');

// Public routes
router.get('/nearby', getNearbyBins); // Get nearby bins (no auth required)

// Protected routes
router.get('/', getBins); // Get all bins (with optional filtering)
router.get('/:id', getBinById); // Get specific bin

// Admin/authenticated routes
router.post('/', auth, createBin); // Create new bin
router.put('/:id', auth, updateBin); // Update bin
router.delete('/:id', auth, deleteBin); // Delete bin

module.exports = router;
