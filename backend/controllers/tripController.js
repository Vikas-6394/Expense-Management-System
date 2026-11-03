const Trip = require('../models/Trip');
const Transaction = require('../models/Transaction');

// @desc    Get all trips with calculated stats
// @route   GET /api/trips
// @access  Private
exports.getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ startDate: -1 });

    const computedTrips = await Promise.all(
      trips.map(async (trip) => {
        const stats = await Transaction.aggregate([
          { $match: { user: req.user._id, trip: trip._id, type: 'expense' } },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: '$amount' },
              transactionCount: { $sum: 1 },
              places: { $addToSet: '$place' },
            },
          },
        ]);

        const totalSpent = stats[0]?.totalSpent || 0;
        const transactionCount = stats[0]?.transactionCount || 0;
        const places = (stats[0]?.places || []).filter(Boolean);

        // Calculate duration in days
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
        const dailyAverage = Number((totalSpent / days).toFixed(2));
        const remainingBudget = Number((trip.budget - totalSpent).toFixed(2));

        return {
          ...trip.toObject(),
          totalSpent: Number(totalSpent.toFixed(2)),
          remainingBudget,
          dailyAverage,
          durationDays: days,
          placesCount: places.length,
          places,
          transactionCount,
        };
      })
    );

    res.status(200).json({ success: true, count: computedTrips.length, trips: computedTrips });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trip with transactions & breakdown
// @route   GET /api/trips/:id
// @access  Private
exports.getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const transactions = await Transaction.find({ user: req.user._id, trip: trip._id })
      .populate('category', 'name icon color')
      .populate('account', 'name type')
      .sort({ date: -1 });

    const totalSpent = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const cat = t.categoryName || 'Other';
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + t.amount;
      });

    // Place breakdown
    const placeBreakdown = {};
    transactions
      .filter((t) => t.type === 'expense' && t.place)
      .forEach((t) => {
        placeBreakdown[t.place] = (placeBreakdown[t.place] || 0) + t.amount;
      });

    res.status(200).json({
      success: true,
      trip,
      totalSpent: Number(totalSpent.toFixed(2)),
      remainingBudget: Number((trip.budget - totalSpent).toFixed(2)),
      categoryBreakdown,
      placeBreakdown,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new trip
// @route   POST /api/trips
// @access  Private
exports.createTrip = async (req, res, next) => {
  try {
    const { name, destination, startDate, endDate, budget, purpose, notes, status } = req.body;

    if (!name || !destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide trip name, destination, start date, and end date',
      });
    }

    const trip = await Trip.create({
      user: req.user._id,
      name: name.trim(),
      destination: destination.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: Number(budget) || 0,
      purpose: purpose ? purpose.trim() : '',
      notes: notes ? notes.trim() : '',
      status: status || 'ongoing',
    });

    res.status(201).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const { name, destination, startDate, endDate, budget, purpose, notes, status } = req.body;

    if (name) trip.name = name.trim();
    if (destination) trip.destination = destination.trim();
    if (startDate) trip.startDate = new Date(startDate);
    if (endDate) trip.endDate = new Date(endDate);
    if (budget !== undefined) trip.budget = Number(budget);
    if (purpose !== undefined) trip.purpose = purpose.trim();
    if (notes !== undefined) trip.notes = notes.trim();
    if (status) trip.status = status;

    await trip.save();

    res.status(200).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trip (unlinks transactions without deleting them)
// @route   DELETE /api/trips/:id
// @access  Private
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Unlink transactions associated with this trip
    await Transaction.updateMany({ user: req.user._id, trip: trip._id }, { $unset: { trip: 1 } });
    await Trip.findByIdAndDelete(trip._id);

    res.status(200).json({ success: true, message: 'Trip deleted and transactions unlinked' });
  } catch (error) {
    next(error);
  }
};
