const express = require('express');
const router = express.Router();

// Middleware
const checkAuth = require('../middlewares/check-auth');

// Controller
const usersController = require('../controllers/index').usersController;

// Routes
router.get('/', usersController.get_all_users);

router.get('/:userId', usersController.get_user);

router.post('/signup', usersController.signup_user, usersController.login_user);

router.post('/login', usersController.login_user);

router.delete('/:userId', checkAuth, usersController.delete_user);

module.exports = router;
