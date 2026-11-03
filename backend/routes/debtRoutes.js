const express = require('express');
const router = express.Router();
const {
  getDebts,
  createDebt,
  recordRepayment,
  updateDebt,
  deleteDebt,
} = require('../controllers/debtController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getDebts)
  .post(createDebt);

router.post('/:id/repay', recordRepayment);

router.route('/:id')
  .put(updateDebt)
  .delete(deleteDebt);

module.exports = router;
