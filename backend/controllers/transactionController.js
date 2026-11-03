const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Category = require('../models/Category');
const Budget = require('../models/Budget');
const Notification = require('../models/Notification');

// Helper to adjust account balance
const adjustAccountBalance = async (accountId, delta) => {
  if (!accountId || delta === 0) return;
  const account = await Account.findById(accountId);
  if (account) {
    account.currentBalance = Number((account.currentBalance + delta).toFixed(2));
    await account.save();
  }
};

// Check if an expense triggers any budget threshold alerts
const checkBudgetThresholds = async (userId, categoryId, amount, transactionDate) => {
  try {
    const txDate = transactionDate ? new Date(transactionDate) : new Date();
    const month = txDate.getMonth() + 1;
    const year = txDate.getFullYear();

    // Find applicable budgets (overall budget or category budget)
    const budgets = await Budget.find({
      user: userId,
      $or: [
        { category: null, period: 'monthly', month, year },
        { category: categoryId, period: 'monthly', month, year },
      ],
    });

    for (const budget of budgets) {
      // Calculate total spending for this category/month
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

      const query = {
        user: userId,
        type: 'expense',
        date: { $gte: startOfMonth, $lte: endOfMonth },
      };

      if (budget.category) {
        query.category = budget.category;
      }

      const totalSpentResult = await Transaction.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      const totalSpent = (totalSpentResult[0]?.total || 0) + amount;
      const percentUsed = Math.round((totalSpent / budget.amount) * 100);

      // Check thresholds
      if (percentUsed >= 100) {
        await Notification.create({
          user: userId,
          title: `Budget Exceeded: ${budget.categoryName}`,
          message: `You have spent ${percentUsed}% of your ${budget.categoryName} budget! Spent: ₹${totalSpent} / ₹${budget.amount}`,
          type: 'danger',
          category: 'budget',
          link: '/budgets',
        });
      } else if (percentUsed >= 90) {
        await Notification.create({
          user: userId,
          title: `Budget Warning: ${budget.categoryName}`,
          message: `You have reached ${percentUsed}% of your ${budget.categoryName} budget. Remaining: ₹${budget.amount - totalSpent}`,
          type: 'warning',
          category: 'budget',
          link: '/budgets',
        });
      } else if (percentUsed >= 75) {
        await Notification.create({
          user: userId,
          title: `Budget Alert: ${budget.categoryName}`,
          message: `You have used ${percentUsed}% of your ${budget.categoryName} budget limit.`,
          type: 'info',
          category: 'budget',
          link: '/budgets',
        });
      }
    }
  } catch (err) {
    console.error('[Budget Check Error]:', err.message);
  }
};

// @desc    Get transactions with multi-filters, pagination, search, sorting
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'date',
      order = 'desc',
      type,
      category,
      account,
      paymentMethod,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      search,
      trip,
      place,
      tag,
    } = req.query;

    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (account) {
      query.$or = [{ account }, { toAccount: account }];
    }
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (trip) query.trip = trip;
    if (place) query.place = new RegExp(place, 'i');
    if (tag) query.tags = tag;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { merchant: searchRegex },
        { place: searchRegex },
        { description: searchRegex },
        { notes: searchRegex },
        { categoryName: searchRegex },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, totalCount] = await Promise.all([
      Transaction.find(query)
        .populate('category', 'name icon color type')
        .populate('account', 'name type color icon accountNumberLast4')
        .populate('toAccount', 'name type color icon accountNumberLast4')
        .populate('trip', 'name destination')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Transaction.countDocuments(query),
    ]);

    // Calculate totals for filtered query (excluding transfers from income/expense)
    const aggregateTotals = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    aggregateTotals.forEach((g) => {
      if (g._id === 'income') totalIncome = g.total;
      if (g._id === 'expense') totalExpense = g.total;
    });

    res.status(200).json({
      success: true,
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / Number(limit)),
      },
      summary: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpense: Number(totalExpense.toFixed(2)),
        netSavings: Number((totalIncome - totalExpense).toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate('category')
      .populate('account')
      .populate('toAccount')
      .populate('trip');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction (Expense, Income, or Transfer)
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res, next) => {
  try {
    const {
      title,
      type = 'expense',
      amount,
      date,
      category,
      categoryName,
      subcategory,
      account,
      toAccount,
      paymentMethod,
      merchant,
      place,
      description,
      notes,
      tags,
      receiptUrl,
      isRecurring,
      recurringFrequency,
      trip,
      bill,
    } = req.body;

    const numAmount = Number(amount);
    if (!title || !numAmount || numAmount <= 0 || !account) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, valid positive amount, and an account.',
      });
    }

    if (type === 'transfer' && (!toAccount || account === toAccount)) {
      return res.status(400).json({
        success: false,
        message: 'Transfer requires a distinct destination account',
      });
    }

    let finalCategoryName = categoryName;
    if (category && !finalCategoryName) {
      const catDoc = await Category.findById(category);
      if (catDoc) finalCategoryName = catDoc.name;
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title: title.trim(),
      type,
      amount: numAmount,
      date: date ? new Date(date) : new Date(),
      category: category || null,
      categoryName: finalCategoryName || (type === 'transfer' ? 'Transfer' : 'Uncategorized'),
      subcategory: subcategory || '',
      account,
      toAccount: type === 'transfer' ? toAccount : null,
      paymentMethod: paymentMethod || 'UPI',
      merchant: merchant ? merchant.trim() : '',
      place: place ? place.trim() : '',
      description: description ? description.trim() : '',
      notes: notes ? notes.trim() : '',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
      receiptUrl: receiptUrl || '',
      isRecurring: Boolean(isRecurring),
      recurringFrequency: recurringFrequency || 'none',
      trip: trip || null,
      bill: bill || null,
    });

    // Update account balance
    if (type === 'expense') {
      await adjustAccountBalance(account, -numAmount);
      // Trigger budget check
      checkBudgetThresholds(req.user._id, category, numAmount, date);
    } else if (type === 'income') {
      await adjustAccountBalance(account, numAmount);
    } else if (type === 'transfer') {
      await adjustAccountBalance(account, -numAmount);
      await adjustAccountBalance(toAccount, numAmount);
    }

    const populatedTx = await Transaction.findById(transaction._id)
      .populate('category')
      .populate('account')
      .populate('toAccount')
      .populate('trip');

    res.status(201).json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`,
      transaction: populatedTx,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    const existingTx = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

    if (!existingTx) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Revert previous account balance adjustments
    if (existingTx.type === 'expense') {
      await adjustAccountBalance(existingTx.account, existingTx.amount);
    } else if (existingTx.type === 'income') {
      await adjustAccountBalance(existingTx.account, -existingTx.amount);
    } else if (existingTx.type === 'transfer') {
      await adjustAccountBalance(existingTx.account, existingTx.amount);
      await adjustAccountBalance(existingTx.toAccount, -existingTx.amount);
    }

    const {
      title,
      type,
      amount,
      date,
      category,
      categoryName,
      subcategory,
      account,
      toAccount,
      paymentMethod,
      merchant,
      place,
      description,
      notes,
      tags,
      receiptUrl,
      isRecurring,
      recurringFrequency,
      trip,
    } = req.body;

    const newType = type || existingTx.type;
    const newAmount = amount !== undefined ? Number(amount) : existingTx.amount;
    const newAccount = account || existingTx.account;
    const newToAccount = toAccount !== undefined ? toAccount : existingTx.toAccount;

    let finalCategoryName = categoryName || existingTx.categoryName;
    if (category && category !== existingTx.category) {
      const catDoc = await Category.findById(category);
      if (catDoc) finalCategoryName = catDoc.name;
    }

    existingTx.title = title !== undefined ? title.trim() : existingTx.title;
    existingTx.type = newType;
    existingTx.amount = newAmount;
    if (date) existingTx.date = new Date(date);
    existingTx.category = category !== undefined ? category : existingTx.category;
    existingTx.categoryName = finalCategoryName;
    if (subcategory !== undefined) existingTx.subcategory = subcategory;
    existingTx.account = newAccount;
    existingTx.toAccount = newType === 'transfer' ? newToAccount : null;
    if (paymentMethod) existingTx.paymentMethod = paymentMethod;
    if (merchant !== undefined) existingTx.merchant = merchant;
    if (place !== undefined) existingTx.place = place;
    if (description !== undefined) existingTx.description = description;
    if (notes !== undefined) existingTx.notes = notes;
    if (tags !== undefined) existingTx.tags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [];
    if (receiptUrl !== undefined) existingTx.receiptUrl = receiptUrl;
    if (isRecurring !== undefined) existingTx.isRecurring = Boolean(isRecurring);
    if (recurringFrequency !== undefined) existingTx.recurringFrequency = recurringFrequency;
    if (trip !== undefined) existingTx.trip = trip;

    await existingTx.save();

    // Apply new account balance adjustments
    if (newType === 'expense') {
      await adjustAccountBalance(newAccount, -newAmount);
    } else if (newType === 'income') {
      await adjustAccountBalance(newAccount, newAmount);
    } else if (newType === 'transfer') {
      await adjustAccountBalance(newAccount, -newAmount);
      await adjustAccountBalance(newToAccount, newAmount);
    }

    const updatedTx = await Transaction.findById(existingTx._id)
      .populate('category')
      .populate('account')
      .populate('toAccount')
      .populate('trip');

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      transaction: updatedTx,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Revert account balance adjustments
    if (transaction.type === 'expense') {
      await adjustAccountBalance(transaction.account, transaction.amount);
    } else if (transaction.type === 'income') {
      await adjustAccountBalance(transaction.account, -transaction.amount);
    } else if (transaction.type === 'transfer') {
      await adjustAccountBalance(transaction.account, transaction.amount);
      await adjustAccountBalance(transaction.toAccount, -transaction.amount);
    }

    await Transaction.findByIdAndDelete(transaction._id);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted and account balance recalculated',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate an existing transaction
// @route   POST /api/transactions/:id/duplicate
// @access  Private
exports.duplicateTransaction = async (req, res, next) => {
  try {
    const original = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

    if (!original) {
      return res.status(404).json({ success: false, message: 'Original transaction not found' });
    }

    const duplicate = await Transaction.create({
      user: req.user._id,
      title: `${original.title} (Copy)`,
      type: original.type,
      amount: original.amount,
      date: new Date(),
      category: original.category,
      categoryName: original.categoryName,
      subcategory: original.subcategory,
      account: original.account,
      toAccount: original.toAccount,
      paymentMethod: original.paymentMethod,
      merchant: original.merchant,
      place: original.place,
      description: original.description,
      notes: original.notes,
      tags: original.tags,
      trip: original.trip,
    });

    // Adjust balance for duplicated transaction
    if (duplicate.type === 'expense') {
      await adjustAccountBalance(duplicate.account, -duplicate.amount);
    } else if (duplicate.type === 'income') {
      await adjustAccountBalance(duplicate.account, duplicate.amount);
    } else if (duplicate.type === 'transfer') {
      await adjustAccountBalance(duplicate.account, -duplicate.amount);
      await adjustAccountBalance(duplicate.toAccount, duplicate.amount);
    }

    const populated = await Transaction.findById(duplicate._id)
      .populate('category')
      .populate('account')
      .populate('toAccount');

    res.status(201).json({
      success: true,
      message: 'Transaction duplicated successfully',
      transaction: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload receipt file attachment
// @route   POST /api/transactions/upload-receipt
// @access  Private
exports.uploadReceipt = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a receipt file' });
    }

    const receiptUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: 'Receipt uploaded successfully',
      receiptUrl,
    });
  } catch (error) {
    next(error);
  }
};
