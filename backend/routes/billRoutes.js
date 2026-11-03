const express = require('express');
const router = express.Router();
const {
  getBills,
  createBill,
  updateBill,
  markAsPaid,
  deleteBill,
} = require('../controllers/billController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getBills)
  .post(createBill);

router.post('/:id/pay', markAsPaid);

router.route('/:id')
  .put(updateBill)
  .delete(deleteBill);

module.exports = router;
