const fs = require('fs');
const config = require('../../configs/config');
const storePath = config[process.env.NODE_ENV].usersNumbers;
const fileUtil = require('../../utils/fileUtil');

/**
 * UsersNumbersModel constructor
 * @returns {undefined}
 */
function UsersNumbersModel() {}

UsersNumbersModel.prototype.create = (numId, userId) => {
  return new Promise((resolve, reject) => {
    try {
      fileUtil.openFile(storePath, (buf, fd) => {
        let usersNumbers = {};
        if (buf.toString()) {
          usersNumbers = JSON.parse(buf.toString());
        }
        if (usersNumbers[userId]) usersNumbers[userId].push(numId);
        else usersNumbers[userId] = [numId];
        fs.writeSync(fd, JSON.stringify(usersNumbers));
        resolve({ numId, userId });
        fs.closeSync(fd);
      });
    } catch(err) {
      reject(err)
    }
  });
}

UsersNumbersModel.prototype.getPhoneNumIds = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      fileUtil.openFile(storePath, (buf, fd) => {
        let numIds = [];
        if (buf.toString()) {
          const data = JSON.parse(buf.toString());
          numIds = data[userId];
        }
        resolve(numIds);
        fs.closeSync(fd);
      });
    } catch(err) {
      reject(err)
    }
  });
}

module.exports = new UsersNumbersModel();