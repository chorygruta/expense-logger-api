const express = require('express');
const router = express.Router();

/* Middleware */
const checkAuth = require('../middlewares/check-auth');

/* Controller */
const expensesController = require('../controllers/index').expensesController;

/* Routes */

// get all expenses
router.get('/', checkAuth, expensesController.get_all_user_expenses);
// creaet a new expense
router.post('/', checkAuth, expensesController.create_new_expense);

module.exports = router;
