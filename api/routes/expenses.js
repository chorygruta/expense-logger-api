const express = require('express');
const router = express.Router();

// Middleware
const checkAuth = require('../middlewares/check-auth');

// Controller
const expensesController = require('../controllers/index').expensesController;

// Routes
router.get('/', checkAuth, expensesController.get_all_user_expenses);

router.post('/', checkAuth, expensesController.create_new_expense);
module.exports = router;
