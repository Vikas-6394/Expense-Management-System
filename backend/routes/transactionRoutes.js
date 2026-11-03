const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  duplicateTransaction,
  uploadReceipt,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.post('/upload-receipt', upload.single('receipt'), uploadReceipt);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

router.post('/:id/duplicate', duplicateTransaction);

module.exports = router;
