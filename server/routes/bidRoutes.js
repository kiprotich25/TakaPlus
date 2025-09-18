const express = require('express');
const router = express.Router();
const bids = require('../controllers/bidsController');
const auth = require('../middleware/auth');

router.post('/', auth, bids.placeBid); // place a bid (auth required)
router.post('/:bidId/accept', auth, bids.acceptBid); // owner accepts a bid

module.exports = router;
