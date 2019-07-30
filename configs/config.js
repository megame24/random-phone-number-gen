const path = require('path');

module.exports = {
  development: {
    users: path.join(__dirname, '../database/store/users.json')
  },
  test: {
    users: path.join(__dirname, '../database/store/test/users_test.json')
  }
};
