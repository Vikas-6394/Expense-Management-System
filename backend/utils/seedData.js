const Category = require('../models/Category');
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const BillReminder = require('../models/BillReminder');
const DebtRecord = require('../models/DebtRecord');

const defaultCategories = [
  // Expense Categories
  { name: 'Food and Drinks', type: 'expense', icon: 'Utensils', color: '#8b5cf6', subcategories: ['Restaurant', 'Coffee', 'Fast Food', 'Snacks'] },
  { name: 'Tea and Snacks', type: 'expense', icon: 'Coffee', color: '#f59e0b', subcategories: ['Chai', 'Bakery', 'Street Food'] },
  { name: 'Groceries', type: 'expense', icon: 'ShoppingBag', color: '#10b981', subcategories: ['Vegetables', 'Fruits', 'Dairy', 'Supermarket'] },
  { name: 'Transport', type: 'expense', icon: 'Bus', color: '#3b82f6', subcategories: ['Bus Fare', 'Metro', 'Auto', 'Cab / Taxi'] },
  { name: 'Petrol and Fuel', type: 'expense', icon: 'Fuel', color: '#ef4444', subcategories: ['Bike Petrol', 'Car Fuel'] },
  { name: 'Rent', type: 'expense', icon: 'Home', color: '#6366f1', subcategories: ['House Rent', 'Office Rent', 'Maintenance'] },
  { name: 'Electricity and Utilities', type: 'expense', icon: 'Zap', color: '#eab308', subcategories: ['Electricity', 'Water', 'Gas Cylinder'] },
  { name: 'Mobile and Internet', type: 'expense', icon: 'Wifi', color: '#06b6d4', subcategories: ['Mobile Recharge', 'Broadband WiFi', 'DTH'] },
  { name: 'Education', type: 'expense', icon: 'GraduationCap', color: '#8b5cf6', subcategories: ['College Fees', 'Books', 'Courses'] },
  { name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#ec4899', subcategories: ['Clothes', 'Electronics', 'Footwear', 'Online Orders'] },
  { name: 'Health', type: 'expense', icon: 'HeartPulse', color: '#14b8a6', subcategories: ['Doctor', 'Pharmacy', 'Lab Tests', 'Fitness'] },
  { name: 'Entertainment', type: 'expense', icon: 'Film', color: '#a855f7', subcategories: ['Movies', 'Gaming', 'Concerts', 'Outing'] },
  { name: 'Travel', type: 'expense', icon: 'Plane', color: '#0ea5e9', subcategories: ['Flight', 'Train', 'Hotel', 'Sightseeing'] },
  { name: 'Personal Care', type: 'expense', icon: 'Sparkles', color: '#f43f5e', subcategories: ['Salon', 'Cosmetics', 'Grooming'] },
  { name: 'Family', type: 'expense', icon: 'Users', color: '#84cc16', subcategories: ['Parents', 'Kids', 'Home Items'] },
  { name: 'EMI and Loan Payments', type: 'expense', icon: 'CreditCard', color: '#d97706', subcategories: ['Home Loan', 'Car Loan', 'Credit Card Bill'] },
  { name: 'Subscriptions', type: 'expense', icon: 'PlayCircle', color: '#6366f1', subcategories: ['Netflix', 'YouTube', 'Spotify', 'Amazon Prime', 'SaaS'] },
  { name: 'Gifts and Donations', type: 'expense', icon: 'Gift', color: '#f97316', subcategories: ['Birthday Gift', 'Charity', 'Wedding'] },
  { name: 'Business Expenses', type: 'expense', icon: 'Briefcase', color: '#475569', subcategories: ['Office Supplies', 'Software', 'Services'] },
  { name: 'Other', type: 'expense', icon: 'MoreHorizontal', color: '#64748b', subcategories: ['Miscellaneous'] },

  // Income Categories
  { name: 'Salary', type: 'income', icon: 'Wallet', color: '#10b981', subcategories: ['Monthly Salary', 'Bonus', 'Incentive'] },
  { name: 'Freelancing', type: 'income', icon: 'Laptop', color: '#06b6d4', subcategories: ['Web Dev', 'Consulting', 'Design'] },
  { name: 'Business', type: 'income', icon: 'TrendingUp', color: '#8b5cf6', subcategories: ['Profits', 'Sales'] },
  { name: 'Scholarship', type: 'income', icon: 'Award', color: '#3b82f6', subcategories: ['Academic', 'Fellowship'] },
  { name: 'Interest', type: 'income', icon: 'Percent', color: '#14b8a6', subcategories: ['Bank Savings', 'Fixed Deposit', 'Dividends'] },
  { name: 'Gift', type: 'income', icon: 'Gift', color: '#ec4899', subcategories: ['Family Gift', 'Reward'] },
  { name: 'Other Income', type: 'income', icon: 'PlusCircle', color: '#64748b', subcategories: ['Cashback', 'Refund', 'Misc'] },
];

const seedDefaultCategories = async (userId = null) => {
  const existingCount = await Category.countDocuments({ user: userId });
  if (existingCount > 0) return;

  const categoriesToInsert = defaultCategories.map((c) => ({
    ...c,
    user: userId,
    isDefault: true,
  }));

  await Category.insertMany(categoriesToInsert);
  console.log(`[Seed] Seeded ${categoriesToInsert.length} default categories for user: ${userId || 'global'}`);
};

// Seed demo user with rich data matching the FinSet screenshot
const seedDemoData = async () => {
  try {
    const demoEmail = 'adaline@finset.com';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: 'Adaline Lively',
        email: demoEmail,
        password: 'password123',
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light',
      });
      console.log(`[Seed] Created demo user: ${demoEmail} / password123`);
    }

    // Seed categories for demo user
    await seedDefaultCategories(user._id);

    // Check accounts
    let accounts = await Account.find({ user: user._id });
    if (accounts.length === 0) {
      accounts = await Account.insertMany([
        { user: user._id, name: 'HDFC Salary Bank', type: 'Bank Account', openingBalance: 50000, currentBalance: 82500, color: '#3b82f6', icon: 'Building2', isDefault: true },
        { user: user._id, name: 'Cash Wallet', type: 'Cash', openingBalance: 5000, currentBalance: 4200, color: '#10b981', icon: 'Wallet' },
        { user: user._id, name: 'GPay UPI', type: 'UPI', openingBalance: 12000, currentBalance: 15400, color: '#8b5cf6', icon: 'Smartphone' },
        { user: user._id, name: 'Mastercard 2154', type: 'Credit Card', openingBalance: 0, currentBalance: -12500, color: '#f43f5e', icon: 'CreditCard' },
      ]);
      console.log(`[Seed] Created ${accounts.length} demo accounts`);
    }

    const bankAccount = accounts[0];
    const cashAccount = accounts[1];
    const upiAccount = accounts[2];
    const cardAccount = accounts[3];

    // Seed transactions if empty
    const txCount = await Transaction.countDocuments({ user: user._id });
    if (txCount === 0) {
      const categories = await Category.find({ user: user._id });
      const catMap = {};
      categories.forEach(c => { catMap[c.name] = c; });

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const sampleTransactions = [
        // Incomes
        {
          user: user._id,
          title: 'Monthly Tech Salary',
          type: 'income',
          amount: 85000,
          date: new Date(currentYear, currentMonth, 1),
          category: catMap['Salary']?._id,
          categoryName: 'Salary',
          account: bankAccount._id,
          paymentMethod: 'Bank Transfer',
          merchant: 'Google Cloud Tech',
          notes: 'Regular monthly salary deposit',
        },
        {
          user: user._id,
          title: 'Freelance UI/UX Consultation',
          type: 'income',
          amount: 22000,
          date: new Date(currentYear, currentMonth, 12),
          category: catMap['Freelancing']?._id,
          categoryName: 'Freelancing',
          account: upiAccount._id,
          paymentMethod: 'UPI',
          merchant: 'Stripe Client',
          notes: 'Milestone 2 payment',
        },
        // Expenses
        {
          user: user._id,
          title: 'Apartment Rent',
          type: 'expense',
          amount: 18000,
          date: new Date(currentYear, currentMonth, 2),
          category: catMap['Rent']?._id,
          categoryName: 'Rent',
          account: bankAccount._id,
          paymentMethod: 'Bank Transfer',
          place: 'Green Villa Towers',
          notes: 'Monthly maintenance included',
        },
        {
          user: user._id,
          title: 'Supermarket Groceries',
          type: 'expense',
          amount: 4250,
          date: new Date(currentYear, currentMonth, 4),
          category: catMap['Groceries']?._id,
          categoryName: 'Groceries',
          account: cardAccount._id,
          paymentMethod: 'Credit Card',
          merchant: 'Nature Basket',
          place: 'City Mall',
        },
        {
          user: user._id,
          title: 'YouTube Premium Family',
          type: 'expense',
          amount: 299,
          date: new Date(currentYear, currentMonth, 5),
          category: catMap['Subscriptions']?._id,
          categoryName: 'Subscriptions',
          account: cardAccount._id,
          paymentMethod: 'Credit Card',
          merchant: 'YouTube',
          notes: 'Auto-renewal',
        },
        {
          user: user._id,
          title: 'Petrol for Bike',
          type: 'expense',
          amount: 800,
          date: new Date(currentYear, currentMonth, 7),
          category: catMap['Petrol and Fuel']?._id,
          categoryName: 'Petrol and Fuel',
          account: upiAccount._id,
          paymentMethod: 'UPI',
          merchant: 'Indian Oil Station',
          place: 'MG Road',
        },
        {
          user: user._id,
          title: 'Cafe & Restaurant Lunch',
          type: 'expense',
          amount: 1250,
          date: new Date(currentYear, currentMonth, 9),
          category: catMap['Food and Drinks']?._id,
          categoryName: 'Food and Drinks',
          account: upiAccount._id,
          paymentMethod: 'UPI',
          merchant: 'Yaposhka Bistro',
          place: 'High Street',
        },
        {
          user: user._id,
          title: 'Zara Casual Wear Shopping',
          type: 'expense',
          amount: 4500,
          date: new Date(currentYear, currentMonth, 11),
          category: catMap['Shopping']?._id,
          categoryName: 'Shopping',
          account: cardAccount._id,
          paymentMethod: 'Credit Card',
          merchant: 'Zara Fashion',
          place: 'Phoenix Mall',
        },
        {
          user: user._id,
          title: 'Airtel Fiber Broadband Bill',
          type: 'expense',
          amount: 1180,
          date: new Date(currentYear, currentMonth, 14),
          category: catMap['Mobile and Internet']?._id,
          categoryName: 'Mobile and Internet',
          account: upiAccount._id,
          paymentMethod: 'UPI',
          merchant: 'Airtel Broadband',
        },
        {
          user: user._id,
          title: 'Evening Tea and Samosa',
          type: 'expense',
          amount: 90,
          date: new Date(currentYear, currentMonth, 16),
          category: catMap['Tea and Snacks']?._id,
          categoryName: 'Tea and Snacks',
          account: cashAccount._id,
          paymentMethod: 'Cash',
          merchant: 'Chai Point',
          place: 'Corner Bakery',
        },
        // Account transfer demo
        {
          user: user._id,
          title: 'ATM Cash Withdrawal',
          type: 'transfer',
          amount: 3000,
          date: new Date(currentYear, currentMonth, 8),
          account: bankAccount._id,
          toAccount: cashAccount._id,
          paymentMethod: 'Bank Transfer',
          notes: 'Cash pocket money',
        }
      ];

      await Transaction.insertMany(sampleTransactions);
      console.log(`[Seed] Seeded ${sampleTransactions.length} demo transactions`);
    }

    // Seed Budgets
    const budgetCount = await Budget.countDocuments({ user: user._id });
    if (budgetCount === 0) {
      const categories = await Category.find({ user: user._id });
      const foodCat = categories.find(c => c.name === 'Food and Drinks');
      const shoppingCat = categories.find(c => c.name === 'Shopping');
      const groceriesCat = categories.find(c => c.name === 'Groceries');

      await Budget.insertMany([
        {
          user: user._id,
          category: null,
          categoryName: 'Overall Monthly Spending',
          period: 'monthly',
          amount: 45000,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          thresholds: [75, 90, 100],
          notes: 'Target spending cap for this month',
        },
        {
          user: user._id,
          category: foodCat?._id,
          categoryName: 'Food and Drinks',
          period: 'monthly',
          amount: 8000,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          thresholds: [75, 90, 100],
        },
        {
          user: user._id,
          category: groceriesCat?._id,
          categoryName: 'Groceries',
          period: 'monthly',
          amount: 7000,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
        {
          user: user._id,
          category: shoppingCat?._id,
          categoryName: 'Shopping',
          period: 'monthly',
          amount: 6000,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
      ]);
      console.log('[Seed] Seeded demo budgets');
    }

    // Seed Savings Goals (Matching FinSet reference: MacBook Pro, New car, New house)
    const goalCount = await SavingsGoal.countDocuments({ user: user._id });
    if (goalCount === 0) {
      await SavingsGoal.insertMany([
        {
          user: user._id,
          name: 'MacBook Pro 16" M3',
          targetAmount: 220000,
          currentAmount: 55000,
          color: '#8b5cf6',
          icon: 'Laptop',
          notes: 'For development & creative studio work',
          contributions: [
            { amount: 30000, date: new Date(2026, 8, 15), note: 'Initial savings' },
            { amount: 25000, date: new Date(2026, 9, 2), note: 'Freelance gig bonus' },
          ],
        },
        {
          user: user._id,
          name: 'New Electric Car (EV)',
          targetAmount: 1500000,
          currentAmount: 630000,
          color: '#3b82f6',
          icon: 'Car',
          notes: 'Down payment for Tata Nexon EV',
          contributions: [
            { amount: 500000, date: new Date(2026, 6, 1), note: 'Annual bonus deposit' },
            { amount: 130000, date: new Date(2026, 8, 20), note: 'Monthly auto-save' },
          ],
        },
        {
          user: user._id,
          name: 'New House Down Payment',
          targetAmount: 4000000,
          currentAmount: 120000,
          color: '#10b981',
          icon: 'Home',
          notes: 'Long-term dream home corpus',
          contributions: [
            { amount: 120000, date: new Date(2026, 5, 10), note: 'Fixed deposit maturity' },
          ],
        },
      ]);
      console.log('[Seed] Seeded demo savings goals');
    }

    // Seed Bills
    const billCount = await BillReminder.countDocuments({ user: user._id });
    if (billCount === 0) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 5);

      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 18);

      await BillReminder.insertMany([
        {
          user: user._id,
          name: 'Electricity Board Bill',
          expectedAmount: 1450,
          dueDate: nextWeek,
          frequency: 'monthly',
          isPaid: false,
          notes: 'Account #5541092',
        },
        {
          user: user._id,
          name: 'Jio 5G Mobile Recharge',
          expectedAmount: 749,
          dueDate: nextMonth,
          frequency: 'monthly',
          isPaid: false,
          notes: 'Primary personal SIM',
        },
      ]);
      console.log('[Seed] Seeded demo bills');
    }

    // Seed Debt / Lending records
    const debtCount = await DebtRecord.countDocuments({ user: user._id });
    if (debtCount === 0) {
      await DebtRecord.insertMany([
        {
          user: user._id,
          type: 'lent',
          personName: 'Rohan Sharma',
          amount: 5000,
          settledAmount: 2000,
          dueDate: new Date(2026, 10, 30),
          status: 'partially_paid',
          notes: 'Lent for urgent medical expenses',
          history: [{ amount: 2000, date: new Date(), note: 'UPI partial return' }],
        },
        {
          user: user._id,
          type: 'borrowed',
          personName: 'Amit Verma',
          amount: 3500,
          settledAmount: 0,
          dueDate: new Date(2026, 11, 15),
          status: 'pending',
          notes: 'Group dinner shared bill',
        },
      ]);
      console.log('[Seed] Seeded demo debt records');
    }
  } catch (err) {
    console.error('[Seed] Error seeding demo data:', err.message);
  }
};

module.exports = { defaultCategories, seedDefaultCategories, seedDemoData };
