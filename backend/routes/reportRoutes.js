const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  exportTransactionsCSV,
  importTransactions,
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboardSummary);
router.get('/export-csv', exportTransactionsCSV);
router.post('/import-csv', importTransactions);

module.exports = router;
