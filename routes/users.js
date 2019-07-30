const { Router } = require('express');
const usersValidator = require('../middleware/validation/usersValidator');
const UsersController = require('../controllers/UsersController');

const { validateUserReg, validateUserLogin } = usersValidator;
const { registerUser, loginUser } = UsersController;

const router = Router();

router.post(
  '/users',
  validateUserReg,
  registerUser
);

router.post(
  '/users/login',
  validateUserLogin,
  loginUser
);

module.exports = router;
