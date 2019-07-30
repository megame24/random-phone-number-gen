/**
 * An abstraction of error response
 * @param {String} message the error message
 * @param {Number} status status code
 * @param {String} code error code
 * @param {String} field invalid field
 * @returns {Object} an error
 */
const throwError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  throw err;
};

module.exports = {
  throwError
};
