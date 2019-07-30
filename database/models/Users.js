const fs = require('fs');
const uuidv4 = require('uuid/v4');
const path = require('path');
const filePath = path.join(__dirname, '../store/users.json');

/**
 * UsersModel constructor
 * @returns {undefined}
 */
function UsersModel() {};

UsersModel.prototype.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    try {
      const buf =  fs.readFileSync(filePath);
      let user = null;
      if (buf.toString()) {
        const data = JSON.parse(buf.toString());
        user = data[email];
      }
      resolve(user);
    } catch(err) {
      console.log(err);
      reject(new Error('An error occurred while finding user'))
    }
  });
}

UsersModel.prototype.create = (user) => {
  user.id = uuidv4();
  return new Promise((resolve, reject) => {
    try {
      const buf = fs.readFileSync(filePath);
      let users = {};
      if (buf.toString()) {
        users = JSON.parse(buf.toString());
      }
      if (users[user.email]) throw new Error('Email must be unique');
      users[user.email] = user;
      fs.open(filePath, 'w+', (err, fd) => {
        if (err) throw err
        else {
          fs.writeSync(fd, JSON.stringify(users));
          resolve(user);
          fs.closeSync(fd);
        }
      });
    } catch(err) {
      console.log(err);
      reject(new Error('An error occurred while creating user'))
    }
  }); 
}

module.exports = new UsersModel();