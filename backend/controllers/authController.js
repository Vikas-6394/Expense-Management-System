const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const Budget = require('../models/Budget');
const Trip = require('../models/Trip');
const BillReminder = require('../models/BillReminder');
const SavingsGoal = require('../models/SavingsGoal');
const DebtRecord = require('../models/DebtRecord');
const Notification = require('../models/Notification');
const { seedDefaultCategories } = require('../utils/seedData');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'finset_jwt_super_secret_production_key_safe_hash_2026_xyz',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, currency } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      currency: currency || 'INR',
    });

    // Seed default categories for this user
    await seedDefaultCategories(user._id);

    // Create default accounts
    await Account.create([
      {
        user: user._id,
        name: 'Bank Account',
        type: 'Bank Account',
        openingBalance: 0,
        currentBalance: 0,
        color: '#3b82f6',
        icon: 'Building2',
        isDefault: true,
      },
      {
        user: user._id,
        name: 'Cash Wallet',
        type: 'Cash',
        openingBalance: 0,
        currentBalance: 0,
        color: '#10b981',
        icon: 'Wallet',
      },
    ]);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // Check for user and include password field for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    // Strip password from output
    const userObj = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & preferences
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, currency, dateFormat, theme, budgetAlertThresholds, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (currency) user.currency = currency;
    if (dateFormat) user.dateFormat = dateFormat;
    if (theme) user.theme = theme;
    if (budgetAlertThresholds) user.budgetAlertThresholds = budgetAlertThresholds;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password request
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email address.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'This email is not registered. Password reset is only available for registered email addresses.',
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save({ validateBeforeSave: false });

    // For in-app / dev convenience, return token info in response or logs
    res.status(200).json({
      success: true,
      message: 'Password reset code generated. Use it to reset your password.',
      resetToken, // Provided directly for immediate reset testing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide reset token and new password' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export all personal data as JSON
// @route   GET /api/auth/export-data
// @access  Private
exports.exportAccountData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      user,
      accounts,
      categories,
      transactions,
      budgets,
      trips,
      bills,
      goals,
      debts,
    ] = await Promise.all([
      User.findById(userId),
      Account.find({ user: userId }),
      Category.find({ user: userId }),
      Transaction.find({ user: userId }).sort({ date: -1 }),
      Budget.find({ user: userId }),
      Trip.find({ user: userId }),
      BillReminder.find({ user: userId }),
      SavingsGoal.find({ user: userId }),
      DebtRecord.find({ user: userId }),
    ]);

    res.status(200).json({
      success: true,
      exportDate: new Date().toISOString(),
      user,
      accounts,
      categories,
      transactions,
      budgets,
      trips,
      bills,
      goals,
      debts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and all personal records
// @route   DELETE /api/auth/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Promise.all([
      Transaction.deleteMany({ user: userId }),
      Account.deleteMany({ user: userId }),
      Category.deleteMany({ user: userId }),
      Budget.deleteMany({ user: userId }),
      Trip.deleteMany({ user: userId }),
      BillReminder.deleteMany({ user: userId }),
      SavingsGoal.deleteMany({ user: userId }),
      DebtRecord.deleteMany({ user: userId }),
      Notification.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.status(200).json({
      success: true,
      message: 'Your account and all associated financial records have been permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
};
