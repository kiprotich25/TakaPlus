const express = require('express');
const router = express.Router();
const listings = require('../controllers/listingsController');
const auth = require('../middleware/auth');

router.get('/', listings.getListings); // public
router.get('/:id', listings.getListingById); // public
router.post('/', auth, listings.createListing); // protected
router.patch('/:id', auth, listings.updateListing); // protected
router.delete('/:id', auth, listings.deleteListing); // protected

module.exports = router;
