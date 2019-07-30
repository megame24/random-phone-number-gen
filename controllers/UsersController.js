const crypto = require('crypto');
const { Users } = require('../database/models');
const tokenService = require('../services/tokenService');
const { throwError } = require('../helpers/errorHelper');

/**
 * UsersController constructor
 * @returns {undefined}
 */
function UsersController() { }

/**
 * Registration controller
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next function in the
 * middleware chain
 * @returns {Object} response object
 */
UsersController.registerUser = async (req, res, next) => {
  let { name, email, password } = req.body;
  const hash = crypto.createHash('sha256');
  hash.update(password);
  password = hash.digest('hex');
  try {
    const user = await Users.create({ name, email, password });
    const tokenPayload = {
      id: user.id,
      role: user.role
    };
    const token = tokenService.generateToken(tokenPayload);
    delete user.password;
    res.status(201).json({
      user,
      token,
      expiresIn: process.env.TOKEN_EXPIRES_IN
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login controller
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next function in the
 * middleware chain
 * @returns {Object} response object
 */
UsersController.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findByEmail(email);
    if (!user) throwError('Email or Password is invalid', 401, 'USR_01', 'email/password');
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const hashedPassword = hash.digest('hex');
    if (hashedPassword !== user.password) {
      throwError('Email or Password is invalid', 401, 'USR_01', 'email/password');
    }
    delete user.password;
    const tokenPayload = {
      id: user.id,
      role: user.role
    };
    const token = tokenService.generateToken(tokenPayload);
    res.status(201).json({
      user,
      token,
      expiresIn: process.env.TOKEN_EXPIRES_IN
    });
  } catch (err) {
    next(err);
  }
};

module.exports = UsersController;
