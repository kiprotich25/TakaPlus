const Listing = require('../models/Listing'); // (1)
const Bid = require('../models/Bid'); // (2)
const { estimateCO2 } = require('../utils/impact'); // (3)

// create
exports.createListing = async (req, res, next) => {
  try {
    const { title, material, quantity, unit, lat, lng, photoUrl } = req.body; // (4)
    if (!title || !material || quantity == null) return res.status(400).json({ error: 'Missing required fields' }); // (5)
    const co2Saved = estimateCO2(material, Number(quantity), unit); // (6)
    const owner = req.user._id; // (7) req.user set by auth middleware
    const listing = await Listing.create({ title, material, quantity: Number(quantity), unit, lat, lng, photoUrl, owner, co2Saved }); // (8)
    await listing.populate('owner', 'name email'); // (9)
    res.status(201).json(listing); // (10)
  } catch (err) {
    next(err);
  }
};

// list
exports.getListings = async (req, res, next) => {
  try {
    const { material } = req.query; // (11)
    const filter = {};
    if (material) filter.material = material;
    const listings = await Listing.find(filter).populate('owner', 'name email').sort({ createdAt: -1 }).limit(200); // (12)
    res.json(listings);
  } catch (err) {
    next(err);
  }
};

// detail
exports.getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email'); // (13)
    if (!listing) return res.status(404).json({ error: 'Not found' }); // (14)
    const bids = await Bid.find({ listing: listing._id }).populate('buyer', 'name email'); // (15)
    res.json({ listing, bids });
  } catch (err) {
    next(err);
  }
};

// update
exports.updateListing = async (req, res, next) => {
  try {
    const updates = req.body; // (16)
    delete updates.owner; // (17) prevent owner change from client
    const listing = await Listing.findById(req.params.id); // (18)
    if (!listing) return res.status(404).json({ error: 'Not found' });
    if (!listing.owner.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' }); // (19)
    const updated = await Listing.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('owner', 'name email'); // (20)
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// delete
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id); // (21)
    if (!listing) return res.status(404).json({ error: 'Not found' });
    if (!listing.owner.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
    await Listing.findByIdAndDelete(req.params.id); // (22)
    await Bid.deleteMany({ listing: req.params.id }); // (23) clean related bids
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
