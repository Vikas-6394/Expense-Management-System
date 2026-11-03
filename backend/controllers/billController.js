const BillReminder = require('../models/BillReminder');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// @desc    Get all bill reminders
// @route   GET /api/bills
// @access  Private
exports.getBills = async (req, res, next) => {
  try {
    const { status } = req.query; // 'unpaid', 'paid', or all
    const query = { user: req.user._id };

    if (status === 'unpaid') query.isPaid = false;
    if (status === 'paid') query.isPaid = true;

    const bills = await BillReminder.find(query)
      .populate('category', 'name icon color')
      .populate('account', 'name type')
      .populate('linkedTransaction')
      .sort({ isPaid: 1, dueDate: 1 });

    const now = new Date();
    const computedBills = bills.map((b) => {
      const isOverdue = !b.isPaid && new Date(b.dueDate) < now;
      const daysUntilDue = Math.ceil((new Date(b.dueDate) - now) / (1000 * 60 * 60 * 24));
      return {
        ...b.toObject(),
        isOverdue,
        daysUntilDue,
      };
    });

    res.status(200).json({ success: true, count: computedBills.length, bills: computedBills });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new bill reminder
// @route   POST /api/bills
// @access  Private
exports.createBill = async (req, res, next) => {
  try {
    const { name, expectedAmount, dueDate, category, categoryName, account, frequency, notes } = req.body;

    const numAmount = Number(expectedAmount);
    if (!name || !numAmount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bill title, expected amount, and due date',
      });
    }

    const bill = await BillReminder.create({
      user: req.user._id,
      name: name.trim(),
      expectedAmount: numAmount,
      dueDate: new Date(dueDate),
      category: category || null,
      categoryName: categoryName || 'Utilities',
      account: account || null,
      frequency: frequency || 'monthly',
      notes: notes ? notes.trim() : '',
    });

    const populated = await BillReminder.findById(bill._id)
      .populate('category', 'name icon color')
      .populate('account', 'name type');

    res.status(201).json({ success: true, bill: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Private
exports.updateBill = async (req, res, next) => {
  try {
    const bill = await BillReminder.findOne({ _id: req.params.id, user: req.user._id });

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill reminder not found' });
    }

    const { name, expectedAmount, dueDate, category, categoryName, account, frequency, notes, isPaid } = req.body;

    if (name) bill.name = name.trim();
    if (expectedAmount !== undefined) bill.expectedAmount = Number(expectedAmount);
    if (dueDate) bill.dueDate = new Date(dueDate);
    if (category !== undefined) bill.category = category;
    if (categoryName) bill.categoryName = categoryName;
    if (account !== undefined) bill.account = account;
    if (frequency) bill.frequency = frequency;
    if (notes !== undefined) bill.notes = notes.trim();
    if (isPaid !== undefined) bill.isPaid = Boolean(isPaid);

    await bill.save();

    const populated = await BillReminder.findById(bill._id)
      .populate('category', 'name icon color')
      .populate('account', 'name type');

    res.status(200).json({ success: true, bill: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark bill as paid (optionally recording an expense transaction)
// @route   POST /api/bills/:id/pay
// @access  Private
exports.markAsPaid = async (req, res, next) => {
  try {
    const bill = await BillReminder.findOne({ _id: req.params.id, user: req.user._id });

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill reminder not found' });
    }

    const { accountId, paidAmount, paymentMethod, createExpenseRecord = true } = req.body;

    const finalAmount = paidAmount !== undefined ? Number(paidAmount) : bill.expectedAmount;
    const finalAccount = accountId || bill.account;

    let transaction = null;

    if (createExpenseRecord) {
      if (!finalAccount) {
        return res.status(400).json({
          success: false,
          message: 'Please select an account to pay this bill from.',
        });
      }

      // Create linked transaction
      transaction = await Transaction.create({
        user: req.user._id,
        title: `Bill Payment: ${bill.name}`,
        type: 'expense',
        amount: finalAmount,
        date: new Date(),
        category: bill.category,
        categoryName: bill.categoryName || 'Utilities',
        account: finalAccount,
        paymentMethod: paymentMethod || 'UPI',
        merchant: bill.name,
        notes: `Paid recurring bill: ${bill.name}`,
        bill: bill._id,
      });

      // Deduct from account balance
      const acc = await Account.findById(finalAccount);
      if (acc) {
        acc.currentBalance = Number((acc.currentBalance - finalAmount).toFixed(2));
        await acc.save();
      }
    }

    bill.isPaid = true;
    bill.paidAt = new Date();
    if (transaction) bill.linkedTransaction = transaction._id;

    await bill.save();

    res.status(200).json({
      success: true,
      message: 'Bill marked as paid successfully',
      bill,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete bill reminder
// @route   DELETE /api/bills/:id
// @access  Private
exports.deleteBill = async (req, res, next) => {
  try {
    const bill = await BillReminder.findOne({ _id: req.params.id, user: req.user._id });

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill reminder not found' });
    }

    await BillReminder.findByIdAndDelete(bill._id);

    res.status(200).json({ success: true, message: 'Bill reminder deleted' });
  } catch (error) {
    next(error);
  }
};
