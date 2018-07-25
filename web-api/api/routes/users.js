const express = require('express');
const router = express.Router();

/* Middleware */
const checkAuth = require('../middlewares/check-auth');

/* Controller */
const usersController = require('../controllers/index').usersController;

/* Routes */

// get all users
router.get('/', usersController.get_all_users);
// get a user
router.get('/:userId', usersController.get_user);
// create a new account and login user with the newly created account
router.post('/signup', usersController.signup_user, usersController.login_user);
// log in a user
router.post('/login', usersController.login_user);
// delete a user
router.delete('/:userId', checkAuth, usersController.delete_user);

module.exports = router;
