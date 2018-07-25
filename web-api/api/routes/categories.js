const express = require('express');
const router = express.Router();

/* Middleware */
const checkAuth = require('../middlewares/check-auth');

/* Controller */
const categoriesController = require('../controllers/index').categoriesController;

/* Routes */
// get categories
router.get('/', checkAuth, categoriesController.get_all_categories);
// create a new category
router.post('/', checkAuth, categoriesController.create_new_category);

module.exports = router;
