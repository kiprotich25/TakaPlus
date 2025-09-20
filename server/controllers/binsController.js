const Bin = require('../models/Bin');

// Create a new bin (admin only)
exports.createBin = async (req, res, next) => {
  try {
    const binData = {
      ...req.body,
      addedBy: req.user._id
    };
    
    const bin = await Bin.create(binData);
    await bin.populate('addedBy', 'name email');
    res.status(201).json(bin);
  } catch (err) {
    next(err);
  }
};

// Get all bins with optional filtering
exports.getBins = async (req, res, next) => {
  try {
    const { 
      binType, 
      status, 
      lat, 
      lng, 
      radius = 10, // km
      limit = 100 
    } = req.query;
    
    let filter = {};
    
    // Filter by bin type
    if (binType) filter.binType = binType;
    
    // Filter by status
    if (status) filter.status = status;
    
    // Location-based filtering
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusKm = parseFloat(radius);
      
      // MongoDB geospatial query for nearby bins
      filter = {
        ...filter,
        lat: {
          $gte: latNum - (radiusKm / 111), // rough conversion: 1 degree ≈ 111 km
          $lte: latNum + (radiusKm / 111)
        },
        lng: {
          $gte: lngNum - (radiusKm / (111 * Math.cos(latNum * Math.PI / 180))),
          $lte: lngNum + (radiusKm / (111 * Math.cos(latNum * Math.PI / 180)))
        }
      };
    }
    
    const bins = await Bin.find(filter)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(bins);
  } catch (err) {
    next(err);
  }
};

// Get bin by ID
exports.getBinById = async (req, res, next) => {
  try {
    const bin = await Bin.findById(req.params.id).populate('addedBy', 'name email');
    if (!bin) return res.status(404).json({ error: 'Bin not found' });
    res.json(bin);
  } catch (err) {
    next(err);
  }
};

// Update bin (admin only)
exports.updateBin = async (req, res, next) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) return res.status(404).json({ error: 'Bin not found' });
    
    // Check if user is admin or the one who added the bin
    if (req.user.role !== 'admin' && !bin.addedBy.equals(req.user._id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const updatedBin = await Bin.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: new Date() }, 
      { new: true }
    ).populate('addedBy', 'name email');
    
    res.json(updatedBin);
  } catch (err) {
    next(err);
  }
};

// Delete bin (admin only)
exports.deleteBin = async (req, res, next) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) return res.status(404).json({ error: 'Bin not found' });
    
    // Only admin can delete bins
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await Bin.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Get nearby bins (public endpoint)
exports.getNearbyBins = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5, binType } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusKm = parseFloat(radius);
    
    let filter = {
      status: 'active', // Only show active bins
      lat: {
        $gte: latNum - (radiusKm / 111),
        $lte: latNum + (radiusKm / 111)
      },
      lng: {
        $gte: lngNum - (radiusKm / (111 * Math.cos(latNum * Math.PI / 180))),
        $lte: lngNum + (radiusKm / (111 * Math.cos(latNum * Math.PI / 180)))
      }
    };
    
    if (binType) filter.binType = binType;
    
    const bins = await Bin.find(filter)
      .select('name description lat lng binType status capacity currentFill operatingHours acceptedMaterials')
      .limit(50);
    
    res.json(bins);
  } catch (err) {
    next(err);
  }
};
