const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// @desc    Get all budgets with computed spending and progress
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month ? Number(month) : new Date().getMonth() + 1;
    const currentYear = year ? Number(year) : new Date().getFullYear();

    const budgets = await Budget.find({
      user: req.user._id,
      month: currentMonth,
      year: currentYear,
    }).populate('category', 'name icon color');

    // Calculate dates for the month
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const now = new Date();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const daysPassed = currentMonth === now.getMonth() + 1 && currentYear === now.getFullYear() ? now.getDate() : daysInMonth;
    const daysRemaining = Math.max(0, daysInMonth - daysPassed);

    // Compute spending for each budget
    const computedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const query = {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        };

        if (budget.category) {
          query.category = budget.category._id;
        }

        const spendingResult = await Transaction.aggregate([
          { $match: query },
          { $group: { _id: null, totalSpent: { $sum: '$amount' }, txCount: { $sum: 1 } } },
        ]);

        const spent = spendingResult[0]?.totalSpent || 0;
        const txCount = spendingResult[0]?.txCount || 0;
        const remaining = Number((budget.amount - spent).toFixed(2));
        const percentage = Math.min(1000, Number(((spent / budget.amount) * 100).toFixed(1)));

        let status = 'normal';
        if (percentage >= 100) status = 'exceeded';
        else if (percentage >= 90) status = 'critical';
        else if (percentage >= 75) status = 'warning';

        return {
          ...budget.toObject(),
          spent: Number(spent.toFixed(2)),
          remaining,
          percentage,
          status,
          transactionCount: txCount,
          daysRemaining,
        };
      })
    );

    res.status(200).json({
      success: true,
      month: currentMonth,
      year: currentYear,
      budgets: computedBudgets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year, thresholds, notes } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid budget amount' });
    }

    const bMonth = month ? Number(month) : new Date().getMonth() + 1;
    const bYear = year ? Number(year) : new Date().getFullYear();

    let categoryName = 'Overall Spending';
    if (category) {
      const catDoc = await Category.findById(category);
      if (catDoc) categoryName = catDoc.name;
    }

    // Check for existing budget for same category and month
    const existing = await Budget.findOne({
      user: req.user._id,
      category: category || null,
      month: bMonth,
      year: bYear,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A budget for ${categoryName} already exists for ${bMonth}/${bYear}. Please edit the existing budget instead.`,
      });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category: category || null,
      categoryName,
      amount: numAmount,
      month: bMonth,
      year: bYear,
      thresholds: thresholds || [75, 90, 100],
      notes: notes || '',
    });

    const populated = await Budget.findById(budget._id).populate('category', 'name icon color');

    res.status(201).json({ success: true, budget: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    const { amount, thresholds, notes } = req.body;
    if (amount !== undefined) budget.amount = Number(amount);
    if (thresholds !== undefined) budget.thresholds = thresholds;
    if (notes !== undefined) budget.notes = notes;

    await budget.save();

    const populated = await Budget.findById(budget._id).populate('category', 'name icon color');
    res.status(200).json({ success: true, budget: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    await Budget.findByIdAndDelete(budget._id);

    res.status(200).json({ success: true, message: 'Budget deleted successfully' });
  } catch (error) {
    next(error);
  }
};
