const fs = require('fs');
const uuidv4 = require('uuid/v4');
const config = require('../../configs/config');
const storePath = config[process.env.NODE_ENV].users;
const fileUtil = require('../../utils/fileUtil');
const { throwError } = require('../../helpers/errorHelper');
const UsersIdToEmail = require('./UsersIdToEmail');

/**
 * UsersModel constructor
 * @returns {undefined}
 */
function UsersModel() {}

UsersModel.prototype.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    try {
      fileUtil.openFile(storePath, (buf, fd) => {
        let user = null;
        if (buf.toString()) {
          const data = JSON.parse(buf.toString());
          user = data[email];
        }
        resolve(user);
        fs.closeSync(fd);
      });
    } catch(err) {
      reject(err)
    }
  });
}

UsersModel.prototype.findById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      fileUtil.openFile(storePath, async (buf, fd) => {
        let user = null;
        if (buf.toString()) {
          const data = JSON.parse(buf.toString());
          const email = await UsersIdToEmail.getEmail(id);
          user = data[email];
        }
        resolve(user);
        fs.closeSync(fd);
      });
    } catch(err) {
      reject(err)
    }
  });
}

UsersModel.prototype.create = (user, role = 'user') => {
  return new Promise((resolve, reject) => {
    try {
      user.id = uuidv4();
      user.role = role;
      fileUtil.openFile(storePath, async (buf, fd) => {
        let users = {};
        if (buf.toString()) {
          users = JSON.parse(buf.toString());
        }
        if (users[user.email]) throwError('Email must be unique', 400);
        users[user.email] = user;
        fs.writeSync(fd, JSON.stringify(users));
        resolve(user);
        await UsersIdToEmail.create(user.id, user.email);
        fs.closeSync(fd);
      })
    } catch(err) {
      reject(err)
    }
  }); 
}

module.exports = new UsersModel();