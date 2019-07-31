const fs = require('fs');
const config = require('../../configs/config');
const storePath = config[process.env.NODE_ENV].usersNumbers;
const fileUtil = require('../../utils/fileUtil');

/**
 * UsersNumsModel constructor
 * @returns {undefined}
 */
function UsersNumsModel() {}

UsersNumsModel.prototype.create = (numId, userId) => {
  return new Promise((resolve, reject) => {
    try {
      fileUtil.openFile(storePath, (buf, fd) => {
        let usersNums = {};
        if (buf.toString()) {
          usersNums = JSON.parse(buf.toString());
        }
        if (usersNums[userId]) usersNums[userId].push(numId);
        else usersNums[userId] = [numId];
        fs.writeSync(fd, JSON.stringify(usersNums));
        resolve({ numId, userId });
        fs.closeSync(fd);
      });
    } catch(err) {
      reject(err)
    }
  });
}

module.exports = new UsersNumsModel();