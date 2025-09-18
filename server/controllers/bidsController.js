const Bid = require('../models/Bid');
const Listing = require('../models/Listing');

// place bid
exports.placeBid = async (req, res, next) => {
  try {
    const { listingId, amount, message } = req.body; // (1)
    if (!listingId) return res.status(400).json({ error: 'Missing listingId' }); // (2)
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ error: 'Listing not found' }); // (3)
    const buyer = req.user._id;
    const bid = await Bid.create({ listing: listingId, buyer, amount, message });
    await bid.populate('buyer', 'name email');
    res.status(201).json(bid);
  } catch (err) {
    next(err);
  }
};

// accept bid (owner only)
exports.acceptBid = async (req, res, next) => {
  try {
    const { bidId } = req.params; // (4)
    const bid = await Bid.findById(bidId).populate('listing');
    if (!bid) return res.status(404).json({ error: 'Bid not found' }); // (5)
    if (!bid.listing.owner.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' }); // (6)
    bid.status = 'accepted';
    await bid.save(); // (7)

    // mark listing accepted
    bid.listing.status = 'accepted';
    await bid.listing.save();

    // reject other bids for same listing
    await Bid.updateMany({ listing: bid.listing._id, _id: { $ne: bid._id } }, { status: 'rejected' }); // (8)

    res.json({ success: true, bid });
  } catch (err) {
    next(err);
  }
};
