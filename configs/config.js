const path = require('path');

module.exports = {
  production: {
    users: path.join(__dirname, '../database/store/users.json'),
    phoneNumbers: path.join(__dirname, '../database/store/phone_numbers.json'),
    usersNumbers: path.join(__dirname, '../database/store/users_numbers.json'),
    usersIdToEmail: path.join(__dirname, '../database/store/users_id_email.json'),
    maxPhoneNumLength: 1000
  },
  development: {
    users: path.join(__dirname, '../database/store/users_dev.json'),
    phoneNumbers: path.join(__dirname, '../database/store/phone_numbers_dev.json'),
    usersNumbers: path.join(__dirname, '../database/store/users_numbers_dev.json'),
    usersIdToEmail: path.join(__dirname, '../database/store/users_id_email_dev.json'),
    maxPhoneNumLength: 1000
  },
  test: {
    users: path.join(__dirname, '../database/store/test/users_test.json'),
    phoneNumbers: path.join(__dirname, '../database/store/test/phone_numbers_test.json'),
    usersNumbers: path.join(__dirname, '../database/store/test/users_numbers_test.json'),
    usersIdToEmail: path.join(__dirname, '../database/store/test/users_id_email_test.json'),
    maxPhoneNumLength: 0
  }
};
