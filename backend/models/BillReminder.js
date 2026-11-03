const mongoose = require('mongoose');

const billReminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a bill title or provider name'],
      trim: true,
      maxlength: 80,
    },
    expectedAmount: {
      type: Number,
      required: [true, 'Please provide an expected amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    categoryName: {
      type: String,
      default: 'Utilities',
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide the bill due date'],
      index: true,
    },
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
      default: 'monthly',
    },
    isPaid: {
      type: Boolean,
      default: false,
      index: true,
    },
    paidAt: {
      type: Date,
    },
    linkedTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

billReminderSchema.index({ user: 1, dueDate: 1, isPaid: 1 });

module.exports = mongoose.model('BillReminder', billReminderSchema);
