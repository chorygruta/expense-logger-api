const express = require('express');
const router = express.Router();

// Middleware
const checkAuth = require('../middlewares/check-auth');

// Controller
const categoriesController = require('../controllers/index').categoriesController;

// Routes
router.get('/', checkAuth, categoriesController.get_all_categories);

router.post('/', checkAuth, categoriesController.create_new_category);

module.exports = router;
