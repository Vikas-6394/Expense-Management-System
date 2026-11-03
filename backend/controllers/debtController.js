const DebtRecord = require('../models/DebtRecord');
const Account = require('../models/Account');

// @desc    Get all debts with summary totals
// @route   GET /api/debts
// @access  Private
exports.getDebts = async (req, res, next) => {
  try {
    const debts = await DebtRecord.find({ user: req.user._id })
      .populate('account', 'name type')
      .sort({ status: 1, dueDate: 1 });

    let totalOwedToMe = 0; // lent
    let totalIOwe = 0; // borrowed

    const computedDebts = debts.map((d) => {
      const remainingBalance = Math.max(0, Number((d.amount - d.settledAmount).toFixed(2)));

      if (d.status !== 'settled') {
        if (d.type === 'lent') {
          totalOwedToMe += remainingBalance;
        } else if (d.type === 'borrowed') {
          totalIOwe += remainingBalance;
        }
      }

      return {
        ...d.toObject(),
        remainingBalance,
      };
    });

    res.status(200).json({
      success: true,
      count: computedDebts.length,
      debts: computedDebts,
      summary: {
        totalOwedToMe: Number(totalOwedToMe.toFixed(2)),
        totalIOwe: Number(totalIOwe.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new debt / loan record
// @route   POST /api/debts
// @access  Private
exports.createDebt = async (req, res, next) => {
  try {
    const { type, personName, amount, date, dueDate, account, notes } = req.body;

    const numAmount = Number(amount);
    if (!type || !personName || !numAmount || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type (lent/borrowed), person name, and valid amount',
      });
    }

    const debt = await DebtRecord.create({
      user: req.user._id,
      type,
      personName: personName.trim(),
      amount: numAmount,
      settledAmount: 0,
      date: date ? new Date(date) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      account: account || null,
      status: 'pending',
      notes: notes ? notes.trim() : '',
    });

    res.status(201).json({ success: true, debt });
  } catch (error) {
    next(error);
  }
};

// @desc    Record repayment / settlement
// @route   POST /api/debts/:id/repay
// @access  Private
exports.recordRepayment = async (req, res, next) => {
  try {
    const debt = await DebtRecord.findOne({ _id: req.params.id, user: req.user._id });

    if (!debt) {
      return res.status(404).json({ success: false, message: 'Debt record not found' });
    }

    const { amount, note, accountId } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid repayment amount' });
    }

    debt.settledAmount = Number((debt.settledAmount + numAmount).toFixed(2));

    if (debt.settledAmount >= debt.amount) {
      debt.status = 'settled';
    } else {
      debt.status = 'partially_paid';
    }

    debt.history.unshift({
      amount: numAmount,
      date: new Date(),
      account: accountId || null,
      note: note || 'Debt repayment',
    });

    await debt.save();

    res.status(200).json({
      success: true,
      message: 'Repayment recorded successfully',
      debt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update debt record
// @route   PUT /api/debts/:id
// @access  Private
exports.updateDebt = async (req, res, next) => {
  try {
    const debt = await DebtRecord.findOne({ _id: req.params.id, user: req.user._id });

    if (!debt) {
      return res.status(404).json({ success: false, message: 'Debt record not found' });
    }

    const { personName, amount, date, dueDate, notes, status } = req.body;

    if (personName) debt.personName = personName.trim();
    if (amount !== undefined) debt.amount = Number(amount);
    if (date) debt.date = new Date(date);
    if (dueDate !== undefined) debt.dueDate = dueDate ? new Date(dueDate) : null;
    if (notes !== undefined) debt.notes = notes.trim();
    if (status) debt.status = status;

    await debt.save();

    res.status(200).json({ success: true, debt });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete debt record
// @route   DELETE /api/debts/:id
// @access  Private
exports.deleteDebt = async (req, res, next) => {
  try {
    const debt = await DebtRecord.findOne({ _id: req.params.id, user: req.user._id });

    if (!debt) {
      return res.status(404).json({ success: false, message: 'Debt record not found' });
    }

    await DebtRecord.findByIdAndDelete(debt._id);

    res.status(200).json({ success: true, message: 'Debt record deleted' });
  } catch (error) {
    next(error);
  }
};
