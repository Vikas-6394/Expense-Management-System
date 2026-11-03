const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// @desc    Get all accounts for user
// @route   GET /api/accounts
// @access  Private
exports.getAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: 1 });
    res.status(200).json({ success: true, count: accounts.length, accounts });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new account
// @route   POST /api/accounts
// @access  Private
exports.createAccount = async (req, res, next) => {
  try {
    const { name, type, accountNumberLast4, openingBalance, color, icon, isDefault, notes } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide an account name' });
    }

    const initialBal = Number(openingBalance) || 0;

    // If setting as default, uncheck previous defaults
    if (isDefault) {
      await Account.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const account = await Account.create({
      user: req.user._id,
      name,
      type: type || 'Bank Account',
      accountNumberLast4: accountNumberLast4 || '',
      openingBalance: initialBal,
      currentBalance: initialBal,
      color: color || '#8b5cf6',
      icon: icon || 'Wallet',
      isDefault: Boolean(isDefault),
      notes: notes || '',
    });

    res.status(201).json({ success: true, account });
  } catch (error) {
    next(error);
  }
};

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
exports.updateAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, user: req.user._id });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    const { name, type, accountNumberLast4, color, icon, isDefault, notes, currentBalance } = req.body;

    if (isDefault && !account.isDefault) {
      await Account.updateMany({ user: req.user._id }, { isDefault: false });
    }

    if (name) account.name = name;
    if (type) account.type = type;
    if (accountNumberLast4 !== undefined) account.accountNumberLast4 = accountNumberLast4;
    if (color) account.color = color;
    if (icon) account.icon = icon;
    if (isDefault !== undefined) account.isDefault = isDefault;
    if (notes !== undefined) account.notes = notes;
    if (currentBalance !== undefined) account.currentBalance = Number(currentBalance);

    await account.save();

    res.status(200).json({ success: true, account });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, user: req.user._id });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    // Check if account has transactions
    const txCount = await Transaction.countDocuments({
      user: req.user._id,
      $or: [{ account: account._id }, { toAccount: account._id }],
    });

    if (txCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete account. There are ${txCount} transactions associated with this account. Please reassign or delete those transactions first.`,
      });
    }

    await Account.findByIdAndDelete(account._id);

    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Transfer between accounts
// @route   POST /api/accounts/transfer
// @access  Private
exports.transferBalance = async (req, res, next) => {
  try {
    const { fromAccountId, toAccountId, amount, date, notes } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Transfer amount must be greater than zero' });
    }

    if (fromAccountId === toAccountId) {
      return res.status(400).json({ success: false, message: 'Source and destination accounts must be different' });
    }

    const fromAccount = await Account.findOne({ _id: fromAccountId, user: req.user._id });
    const toAccount = await Account.findOne({ _id: toAccountId, user: req.user._id });

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ success: false, message: 'One or both accounts could not be found' });
    }

    // Deduct from source and add to destination
    fromAccount.currentBalance = Number((fromAccount.currentBalance - numAmount).toFixed(2));
    toAccount.currentBalance = Number((toAccount.currentBalance + numAmount).toFixed(2));

    await Promise.all([fromAccount.save(), toAccount.save()]);

    // Create a transfer transaction record
    const transaction = await Transaction.create({
      user: req.user._id,
      title: `Transfer: ${fromAccount.name} -> ${toAccount.name}`,
      type: 'transfer',
      amount: numAmount,
      date: date ? new Date(date) : new Date(),
      account: fromAccount._id,
      toAccount: toAccount._id,
      paymentMethod: 'Bank Transfer',
      notes: notes || `Internal account transfer`,
    });

    res.status(201).json({
      success: true,
      message: 'Transfer completed successfully',
      transaction,
      fromAccount,
      toAccount,
    });
  } catch (error) {
    next(error);
  }
};
