const SavingsGoal = require('../models/SavingsGoal');
const Account = require('../models/Account');

// @desc    Get all savings goals
// @route   GET /api/goals
// @access  Private
exports.getGoals = async (req, res, next) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user._id }).sort({ createdAt: -1 });

    const now = new Date();
    const computedGoals = goals.map((g) => {
      const percentage = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
      const remainingAmount = Math.max(0, Number((g.targetAmount - g.currentAmount).toFixed(2)));
      let daysRemaining = null;
      if (g.targetDate) {
        daysRemaining = Math.max(0, Math.ceil((new Date(g.targetDate) - now) / (1000 * 60 * 60 * 24)));
      }

      return {
        ...g.toObject(),
        percentage,
        remainingAmount,
        daysRemaining,
      };
    });

    res.status(200).json({ success: true, count: computedGoals.length, goals: computedGoals });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new savings goal
// @route   POST /api/goals
// @access  Private
exports.createGoal = async (req, res, next) => {
  try {
    const { name, targetAmount, currentAmount, targetDate, color, icon, notes } = req.body;

    const numTarget = Number(targetAmount);
    if (!name || !numTarget || numTarget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide goal name and a valid target amount',
      });
    }

    const initialCurrent = Number(currentAmount) || 0;

    const goal = await SavingsGoal.create({
      user: req.user._id,
      name: name.trim(),
      targetAmount: numTarget,
      currentAmount: initialCurrent,
      targetDate: targetDate ? new Date(targetDate) : null,
      color: color || '#8b5cf6',
      icon: icon || 'Target',
      notes: notes ? notes.trim() : '',
      isCompleted: initialCurrent >= numTarget,
      contributions: initialCurrent > 0 ? [{
        amount: initialCurrent,
        type: 'deposit',
        date: new Date(),
        note: 'Initial starting savings',
      }] : [],
    });

    res.status(201).json({ success: true, goal });
  } catch (error) {
    next(error);
  }
};

// @desc    Add deposit or withdrawal to a savings goal
// @route   POST /api/goals/:id/contribute
// @access  Private
exports.addContribution = async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Savings goal not found' });
    }

    const { amount, type = 'deposit', accountId, note } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Contribution amount must be greater than zero' });
    }

    let accountName = '';
    if (accountId) {
      const account = await Account.findOne({ _id: accountId, user: req.user._id });
      if (account) {
        accountName = account.name;
        // If deposit to savings: reduce available account balance
        // If withdrawal from savings: return to account balance
        if (type === 'deposit') {
          account.currentBalance = Number((account.currentBalance - numAmount).toFixed(2));
        } else {
          account.currentBalance = Number((account.currentBalance + numAmount).toFixed(2));
        }
        await account.save();
      }
    }

    if (type === 'deposit') {
      goal.currentAmount = Number((goal.currentAmount + numAmount).toFixed(2));
    } else {
      goal.currentAmount = Math.max(0, Number((goal.currentAmount - numAmount).toFixed(2)));
    }

    goal.isCompleted = goal.currentAmount >= goal.targetAmount;

    goal.contributions.unshift({
      amount: numAmount,
      type,
      account: accountId || null,
      accountName,
      date: new Date(),
      note: note || (type === 'deposit' ? 'Goal contribution' : 'Goal withdrawal'),
    });

    await goal.save();

    res.status(200).json({
      success: true,
      message: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} recorded successfully`,
      goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
exports.updateGoal = async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Savings goal not found' });
    }

    const { name, targetAmount, targetDate, color, icon, notes, isCompleted } = req.body;

    if (name) goal.name = name.trim();
    if (targetAmount !== undefined) goal.targetAmount = Number(targetAmount);
    if (targetDate !== undefined) goal.targetDate = targetDate ? new Date(targetDate) : null;
    if (color) goal.color = color;
    if (icon) goal.icon = icon;
    if (notes !== undefined) goal.notes = notes.trim();
    if (isCompleted !== undefined) goal.isCompleted = Boolean(isCompleted);

    await goal.save();

    res.status(200).json({ success: true, goal });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Savings goal not found' });
    }

    await SavingsGoal.findByIdAndDelete(goal._id);

    res.status(200).json({ success: true, message: 'Savings goal deleted' });
  } catch (error) {
    next(error);
  }
};
