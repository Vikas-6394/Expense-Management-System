const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const { seedDefaultCategories } = require('../utils/seedData');

// @desc    Get all categories for user (including default system categories)
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = {
      $or: [{ user: req.user._id }, { user: null }],
    };

    if (type) {
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ type: 1, name: 1 });
    res.status(200).json({ success: true, count: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create custom category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res, next) => {
  try {
    const { name, type, icon, color, subcategories } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a category name' });
    }

    const category = await Category.create({
      user: req.user._id,
      name: name.trim(),
      type: type || 'expense',
      icon: icon || 'Tag',
      color: color || '#8b5cf6',
      subcategories: Array.isArray(subcategories) ? subcategories : [],
      isDefault: false,
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { user: null }],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, icon, color, subcategories } = req.body;
    if (name) category.name = name.trim();
    if (icon) category.icon = icon;
    if (color) category.color = color;
    if (subcategories !== undefined) category.subcategories = subcategories;

    // If it was a system category, claim it as user-specific on edit
    if (!category.user) {
      category.user = req.user._id;
      category.isDefault = false;
    }

    await category.save();

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Custom category not found or cannot delete default system category' });
    }

    // Check if transactions exist under this category
    const txCount = await Transaction.countDocuments({
      user: req.user._id,
      category: category._id,
    });

    if (txCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. There are ${txCount} transactions categorized under "${category.name}". Please reassign them first.`,
      });
    }

    await Category.findByIdAndDelete(category._id);

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore default categories
// @route   POST /api/categories/reset-defaults
// @access  Private
exports.resetDefaults = async (req, res, next) => {
  try {
    await seedDefaultCategories(req.user._id);
    const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
    res.status(200).json({ success: true, message: 'Default categories loaded', categories });
  } catch (error) {
    next(error);
  }
};
