const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    type: {
      type: String,
      enum: ['expense', 'income', 'transfer'],
      default: 'expense',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
    categoryName: {
      type: String,
      default: 'Uncategorized',
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Please specify an account'],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      // Required if type is 'transfer'
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Bank Transfer', 'Debit Card', 'Credit Card', 'Net Banking', 'Cheque', 'Wallet', 'Other'],
      default: 'UPI',
    },
    merchant: {
      type: String,
      trim: true,
      default: '',
      maxlength: 80,
    },
    place: {
      type: String,
      trim: true,
      default: '',
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 300,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 500,
    },
    tags: {
      type: [String],
      default: [],
    },
    receiptUrl: {
      type: String,
      default: '',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none',
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      index: true,
    },
    bill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BillReminder',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
