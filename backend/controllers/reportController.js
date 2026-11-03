const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Category = require('../models/Category');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const BillReminder = require('../models/BillReminder');
const DebtRecord = require('../models/DebtRecord');
const { format } = require('fast-csv');

// @desc    Get complete dashboard summary matching FinSet aesthetic
// @route   GET /api/reports/dashboard
// @access  Private
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period = 'thisMonth' } = req.query;

    const now = new Date();
    let startDate, endDate, prevStartDate, prevEndDate;

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 1);
      prevEndDate = new Date(endDate);
      prevEndDate.setDate(prevEndDate.getDate() - 1);
    } else if (period === 'thisWeek') {
      const day = now.getDay() || 7; // Monday = 1
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day + 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 7);
      prevEndDate = new Date(startDate);
      prevEndDate.setMilliseconds(-1);
    } else if (period === 'lastMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);
    } else if (period === 'thisYear') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
      prevEndDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
    } else {
      // Default: thisMonth
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    }

    // 1. Total Account Balance across all accounts
    const accounts = await Account.find({ user: userId });
    const totalBalance = accounts.reduce((acc, curr) => acc + curr.currentBalance, 0);

    // 2. Current period income and expenses
    const periodTotals = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let income = 0;
    let expense = 0;
    periodTotals.forEach((t) => {
      if (t._id === 'income') income = t.total;
      if (t._id === 'expense') expense = t.total;
    });

    // 3. Previous period income and expenses for growth %
    const prevTotals = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: prevStartDate, $lte: prevEndDate },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let prevIncome = 0;
    let prevExpense = 0;
    prevTotals.forEach((t) => {
      if (t._id === 'income') prevIncome = t.total;
      if (t._id === 'expense') prevExpense = t.total;
    });

    const incomeGrowth = prevIncome > 0 ? Number((((income - prevIncome) / prevIncome) * 100).toFixed(1)) : 0;
    const expenseGrowth = prevExpense > 0 ? Number((((expense - prevExpense) / prevExpense) * 100).toFixed(1)) : 0;

    // 4. Savings Goals Total
    const goals = await SavingsGoal.find({ user: userId });
    const totalSavings = goals.reduce((acc, curr) => acc + curr.currentAmount, 0);

    // 5. Debt Summary (Owed to me vs I owe)
    const debts = await DebtRecord.find({ user: userId, status: { $ne: 'settled' } });
    let moneyOwedToMe = 0;
    let moneyIOwe = 0;
    debts.forEach((d) => {
      const remaining = d.amount - d.settledAmount;
      if (d.type === 'lent') moneyOwedToMe += remaining;
      else if (d.type === 'borrowed') moneyIOwe += remaining;
    });

    // 6. Recent Transactions (last 6)
    const recentTransactions = await Transaction.find({ user: userId })
      .populate('category', 'name icon color')
      .populate('account', 'name type accountNumberLast4')
      .sort({ date: -1 })
      .limit(6);

    // 7. Monthly Flow Chart for the whole current year (Jan - Dec)
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    const yearFlowAggregate = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: yearStart, $lte: yearEnd },
          type: { $in: ['income', 'expense'] },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const moneyFlowData = months.map((monthName, idx) => {
      const mNum = idx + 1;
      const inc = yearFlowAggregate.find((item) => item._id.month === mNum && item._id.type === 'income')?.total || 0;
      const exp = yearFlowAggregate.find((item) => item._id.month === mNum && item._id.type === 'expense')?.total || 0;
      return {
        name: monthName,
        income: inc,
        expense: exp,
      };
    });

    // 8. Category Breakdown for current period
    const categoryAggregate = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$categoryName',
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { amount: -1 } },
      { $limit: 8 },
    ]);

    const categoryBreakdown = categoryAggregate.map((c, i) => {
      const palette = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#f43f5e', '#64748b'];
      return {
        name: c._id || 'Other',
        value: c.amount,
        color: palette[i % palette.length],
      };
    });

    // 9. Upcoming Bills (unpaid, next 30 days)
    const upcomingBills = await BillReminder.find({
      user: userId,
      isPaid: false,
    })
      .sort({ dueDate: 1 })
      .limit(4);

    // 10. Savings Goals Progress (top 3)
    const savingsGoalsProgress = goals.slice(0, 3).map((g) => ({
      _id: g._id,
      name: g.name,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      percentage: Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)),
      color: g.color || '#8b5cf6',
    }));

    // 11. Overall monthly budget progress
    const monthlyBudget = await Budget.findOne({
      user: userId,
      category: null,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    let budgetSummary = null;
    if (monthlyBudget) {
      const budgetRemaining = Math.max(0, monthlyBudget.amount - expense);
      const budgetPercent = Math.min(1000, Math.round((expense / monthlyBudget.amount) * 100));
      budgetSummary = {
        limit: monthlyBudget.amount,
        spent: expense,
        remaining: budgetRemaining,
        percent: budgetPercent,
      };
    }

    res.status(200).json({
      success: true,
      period,
      summary: {
        totalBalance: Number(totalBalance.toFixed(2)),
        income: Number(income.toFixed(2)),
        expense: Number(expense.toFixed(2)),
        netSavings: Number((income - expense).toFixed(2)),
        totalSavings: Number(totalSavings.toFixed(2)),
        incomeGrowth,
        expenseGrowth,
        moneyOwedToMe: Number(moneyOwedToMe.toFixed(2)),
        moneyIOwe: Number(moneyIOwe.toFixed(2)),
      },
      budgetSummary,
      moneyFlowData,
      categoryBreakdown,
      recentTransactions,
      upcomingBills,
      savingGoals: savingsGoalsProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export filtered transactions to CSV
// @route   GET /api/reports/export-csv
// @access  Private
exports.exportTransactionsCSV = async (req, res, next) => {
  try {
    const { startDate, endDate, type, category, account } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (account) query.account = account;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('category', 'name')
      .populate('account', 'name')
      .populate('toAccount', 'name')
      .sort({ date: -1 });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=transactions-${Date.now()}.csv`);

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    transactions.forEach((tx) => {
      // Escape potential formula injection characters (=, +, -, @)
      const sanitize = (val) => {
        if (!val) return '';
        const str = String(val);
        if (/^[=+\-@]/.test(str)) {
          return `'${str}`;
        }
        return str;
      };

      csvStream.write({
        Date: tx.date ? new Date(tx.date).toISOString().split('T')[0] : '',
        Title: sanitize(tx.title),
        Type: tx.type,
        Amount: tx.amount,
        Category: sanitize(tx.category?.name || tx.categoryName),
        Subcategory: sanitize(tx.subcategory),
        Account: sanitize(tx.account?.name),
        DestinationAccount: sanitize(tx.toAccount?.name),
        PaymentMethod: sanitize(tx.paymentMethod),
        Merchant: sanitize(tx.merchant),
        Place: sanitize(tx.place),
        Description: sanitize(tx.description),
        Notes: sanitize(tx.notes),
        Tags: tx.tags.join('; '),
      });
    });

    csvStream.end();
  } catch (error) {
    next(error);
  }
};

// @desc    Import transactions from CSV records (preview or save)
// @route   POST /api/reports/import-csv
// @access  Private
exports.importTransactions = async (req, res, next) => {
  try {
    const { rows, dryRun = true } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide CSV rows to import' });
    }

    const accounts = await Account.find({ user: req.user._id });
    const categories = await Category.find({
      $or: [{ user: req.user._id }, { user: null }],
    });

    const defaultAccount = accounts.find((a) => a.isDefault) || accounts[0];
    const validationErrors = [];
    const validRecords = [];
    let duplicatesDetected = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;

      const title = row.Title || row.title || row.Description || row.description;
      const amount = Number(row.Amount || row.amount);
      const type = (row.Type || row.type || 'expense').toLowerCase();
      const dateStr = row.Date || row.date;

      if (!title) {
        validationErrors.push(`Row ${rowNum}: Missing title/description`);
        continue;
      }
      if (!amount || isNaN(amount) || amount <= 0) {
        validationErrors.push(`Row ${rowNum}: Invalid amount "${row.Amount}"`);
        continue;
      }

      const txDate = dateStr ? new Date(dateStr) : new Date();
      if (isNaN(txDate.getTime())) {
        validationErrors.push(`Row ${rowNum}: Invalid date format "${dateStr}"`);
        continue;
      }

      // Check for matching account or fallback to default
      const matchedAccount = accounts.find((a) =>
        a.name.toLowerCase() === (row.Account || row.account || '').toLowerCase()
      ) || defaultAccount;

      // Check for matching category
      const catName = row.Category || row.category || 'Other';
      const matchedCat = categories.find((c) =>
        c.name.toLowerCase() === catName.toLowerCase()
      );

      // Check for potential duplicate in DB (same title, amount, and date within same day)
      const startOfDay = new Date(txDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(txDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingDuplicate = await Transaction.findOne({
        user: req.user._id,
        title: title.trim(),
        amount,
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      const isDuplicate = Boolean(existingDuplicate);
      if (isDuplicate) duplicatesDetected++;

      validRecords.push({
        user: req.user._id,
        title: title.trim(),
        type: ['expense', 'income', 'transfer'].includes(type) ? type : 'expense',
        amount,
        date: txDate,
        category: matchedCat?._id || null,
        categoryName: matchedCat?.name || catName,
        subcategory: row.Subcategory || row.subcategory || '',
        account: matchedAccount?._id,
        accountName: matchedAccount?.name,
        paymentMethod: row.PaymentMethod || row.paymentMethod || 'UPI',
        merchant: row.Merchant || row.merchant || '',
        place: row.Place || row.place || '',
        notes: row.Notes || row.notes || '',
        isPotentialDuplicate: isDuplicate,
      });
    }

    if (dryRun) {
      return res.status(200).json({
        success: true,
        dryRun: true,
        totalRows: rows.length,
        validCount: validRecords.length,
        errorCount: validationErrors.length,
        duplicatesDetected,
        errors: validationErrors,
        preview: validRecords.slice(0, 10), // return first 10 for user confirmation preview
      });
    }

    // Actual insert
    const inserted = await Transaction.insertMany(validRecords);

    // Update account balances
    for (const record of validRecords) {
      if (record.account) {
        const delta = record.type === 'expense' ? -record.amount : record.type === 'income' ? record.amount : 0;
        if (delta !== 0) {
          const acc = await Account.findById(record.account);
          if (acc) {
            acc.currentBalance = Number((acc.currentBalance + delta).toFixed(2));
            await acc.save();
          }
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} transactions.`,
      importedCount: inserted.length,
    });
  } catch (error) {
    next(error);
  }
};
