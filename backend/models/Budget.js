const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null, // null represents overall monthly/weekly spending budget
    },
    categoryName: {
      type: String,
      default: 'Overall Spending',
    },
    period: {
      type: String,
      enum: ['monthly', 'weekly', 'custom'],
      default: 'monthly',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please specify a budget limit amount'],
      min: [1, 'Budget limit must be at least 1'],
    },
    month: {
      type: Number, // 1 - 12
      default: () => new Date().getMonth() + 1,
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    thresholds: {
      type: [Number],
      default: [75, 90, 100],
    },
    notes: {
      type: String,
      default: '',
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate budgets for same category and period/month/year
budgetSchema.index({ user: 1, category: 1, period: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
