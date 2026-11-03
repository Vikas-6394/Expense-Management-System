const mongoose = require('mongoose');

const savingsContributionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal'],
    default: 'deposit',
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  accountName: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: '',
  },
});

const savingsGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a goal name'],
      trim: true,
      maxlength: 80,
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please provide a target amount'],
      min: [1, 'Target amount must be at least 1'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    targetDate: {
      type: Date,
    },
    color: {
      type: String,
      default: '#8b5cf6',
    },
    icon: {
      type: String,
      default: 'Target',
    },
    notes: {
      type: String,
      default: '',
      maxlength: 300,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    contributions: [savingsContributionSchema],
  },
  {
    timestamps: true,
  }
);

savingsGoalSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
