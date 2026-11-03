const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a trip name'],
      trim: true,
      maxlength: 80,
    },
    destination: {
      type: String,
      required: [true, 'Please provide a destination'],
      trim: true,
      maxlength: 100,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    budget: {
      type: Number,
      default: 0,
      min: 0,
    },
    purpose: {
      type: String,
      trim: true,
      default: '',
      maxlength: 200,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['planned', 'ongoing', 'completed'],
      default: 'ongoing',
    },
  },
  {
    timestamps: true,
  }
);

tripSchema.index({ user: 1, startDate: -1 });

module.exports = mongoose.model('Trip', tripSchema);
