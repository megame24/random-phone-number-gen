const jwt = require('jsonwebtoken');

const tokenService = {
  /**
   * Generate a token
   * @param {Object} payload - object to be encoded into a token
   * @param {Number} expiresIn - time for token to expire
   * @returns {String} token
   */
  generateToken(payload) {
    return jwt.sign(payload, process.env.AUTH_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_IN
    });
  },
  /**
   * Verify token
   * @param {String} token - token
   * @returns {undefined}
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.AUTH_SECRET);
    } catch (err) {
      return false;
    }
  },
};

module.exports = tokenService;
