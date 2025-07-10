const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  setBudget,
  getBudgets,
  checkBudgetStatus,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');

router.post('/', auth, setBudget);
router.get('/', auth, getBudgets);
router.get('/status', auth, checkBudgetStatus);
router.put('/:id', auth, updateBudget);
router.delete('/:id', auth, deleteBudget);

module.exports = router;
