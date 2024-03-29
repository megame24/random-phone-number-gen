const fs = require('fs');
const config = require('../../configs/config');
const storePath = config[process.env.NODE_ENV].usersIdToEmail;
const fileUtil = require('../../utils/fileUtil');

/**
 * UsersIdToEmailModel constructor
 * @returns {undefined}
 */
function UsersIdToEmailModel() {}

/**
 * Get user email by id
 * @param {String} userId user id
 * @returns {String} email
 */
UsersIdToEmailModel.prototype.getEmail = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      fileUtil.openFile(storePath, (buf, fd) => {
        let email = null;
        if (buf.toString()) {
          const data = JSON.parse(buf.toString());
          email = data[userId];
        }
        resolve(email);
        fs.closeSync(fd);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Create user email to id relationship
 * @param {String} userId user id
 * @param {String} email email
 * @returns {Object} object of userId and email
 */
UsersIdToEmailModel.prototype.create = (userId, email) => {
  return new Promise((resolve, reject) => {
    try {
      fileUtil.openFile(storePath, (buf, fd) => {
        let usersIdToEmail = {};
        if (buf.toString()) {
          usersIdToEmail = JSON.parse(buf.toString());
        }
        usersIdToEmail[userId] = email;
        fs.writeSync(fd, JSON.stringify(usersIdToEmail));
        resolve({ userId, email });
        fs.closeSync(fd);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = new UsersIdToEmailModel();
