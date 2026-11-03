const mongoose = require('mongoose');

const repaymentHistorySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  note: {
    type: String,
    default: '',
  },
});

const debtRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['lent', 'borrowed'], // 'lent': owed to user, 'borrowed': user owes to others
      required: true,
      index: true,
    },
    personName: {
      type: String,
      required: [true, 'Please provide the person or entity name'],
      trim: true,
      maxlength: 80,
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the loan/lent amount'],
      min: [1, 'Amount must be greater than zero'],
    },
    settledAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    status: {
      type: String,
      enum: ['pending', 'partially_paid', 'settled'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
      maxlength: 300,
    },
    history: [repaymentHistorySchema],
  },
  {
    timestamps: true,
  }
);

debtRecordSchema.index({ user: 1, type: 1, status: 1 });

module.exports = mongoose.model('DebtRecord', debtRecordSchema);
