const fs = require('fs');
const uuidv4 = require('uuid/v4');
const config = require('../../configs/config');
const storePath = config[process.env.NODE_ENV]['users'];

/**
 * UsersModel constructor
 * @returns {undefined}
 */
function UsersModel() {};

UsersModel.prototype.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    try {
      UsersModel.openFile((buf, fd) => {
        let user = null;
        if (buf.toString()) {
          const data = JSON.parse(buf.toString());
          user = data[email];
        }
        resolve(user);
        fs.closeSync(fd);
      });
    } catch(err) {
      console.log(err);
      reject(new Error('An error occurred while finding user'))
    }
  });
}

UsersModel.prototype.create = (user) => {
  return new Promise((resolve, reject) => {
    try {
      user.id = uuidv4();
      user.role = 'user';
      UsersModel.openFile((buf, fd) => {
        let users = {};
        if (buf.toString()) {
          users = JSON.parse(buf.toString());
        }
        if (users[user.email]) throw new Error('Email must be unique');
        users[user.email] = user;
        fs.writeSync(fd, JSON.stringify(users));
        resolve(user);
        fs.closeSync(fd);
      })
    } catch(err) {
      console.log(err);
      reject(new Error('An error occurred while creating user'))
    }
  }); 
}

UsersModel.openFile = (cb) => {
  let flag = 'w+';
  if (fs.existsSync(storePath)) flag = 'r+';
  fs.open(storePath, flag, (err, fd) => {
    const fileSize = fs.statSync(storePath).size;
    const buf = Buffer.alloc(fileSize);
    if (err) throw err;
    fs.readSync(fd, buf, 0, fileSize, 0);
    cb(buf, fd);
  });
}

module.exports = new UsersModel();