const express = require('express');
const expenseController = require('../controller/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes protected
router.use(authMiddleware.protect);

// POST /api/expenses
router.post('/', expenseController.addExpense);

// GET /api/expenses
router.get('/', expenseController.getExpense);

// Get Summaries
router.get('/summary/monthly', expenseController.getMonthlySummary);
router.get('/summary/category', expenseController.getCategoryBreakdown);

// PATCH /api/expenses/:id
router.patch('/:id', expenseController.updateExpense);

// DELETE /api/expenses/:id
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;