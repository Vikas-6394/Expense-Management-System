const express = require('express');
const router = express.Router();
const {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  transferBalance,
} = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAccounts)
  .post(createAccount);

router.post('/transfer', transferBalance);

router.route('/:id')
  .put(updateAccount)
  .delete(deleteAccount);

module.exports = router;
