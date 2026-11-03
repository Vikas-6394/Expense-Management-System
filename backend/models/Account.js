const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide an account name'],
      trim: true,
      maxlength: [50, 'Account name cannot exceed 50 characters'],
    },
    type: {
      type: String,
      required: true,
      enum: ['Cash', 'Bank Account', 'UPI', 'Debit Card', 'Credit Card', 'Wallet', 'Savings', 'Other'],
      default: 'Bank Account',
    },
    accountNumberLast4: {
      type: String,
      trim: true,
      maxlength: 4,
      default: '',
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#8b5cf6',
    },
    icon: {
      type: String,
      default: 'Wallet',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      maxlength: 200,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('Account', accountSchema);
