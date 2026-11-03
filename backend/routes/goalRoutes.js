const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  addContribution,
  deleteGoal,
} = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.post('/:id/contribute', addContribution);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

module.exports = router;
