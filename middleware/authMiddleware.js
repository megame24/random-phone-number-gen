const tokenService = require('../services/tokenService');
const { Users } = require('../database/models');
const { throwError } = require('../helpers/errorHelper');

/**
* Authentication middleware
 * @returns {undefined}
*/
function AuthMiddleware() {}

/**
* Authenticate user
* @param {Object} req request object
* @param {Object} res response object
* @param {Function} next a call to the next function
* @returns {Object} a function on success and an error object on failure
*/
AuthMiddleware.prototype.authenticateUser = async (req, res, next) => {
  let decoded;
  const { token } = req.headers;
  try {
    // return error if no token
    if (!token) throwError('Token not present or invalid', 401);
    if (token) decoded = tokenService.verifyToken(token);
    // return error if no token is invalid
    if (!decoded) throwError('Token not present or invalid', 401);
    const user = await Users.findById(decoded.id);
    // return error if user is not found
    if (!user) throwError('Token not present or invalid', 401);
    req.user = user;
    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = new AuthMiddleware();
