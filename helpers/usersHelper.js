const { Users } = require('../database/models');
const crypto = require('crypto');

const createAdmin = async () => {
  const email = 'admin@phoneNumGen.com';
  if (await Users.findByEmail(email)) return;
  let password = process.env.ADMIN_PASSWORD;
  const hash = crypto.createHash('sha256');
  hash.update(password);
  password = hash.digest('hex');
  const user = {
    name: 'System Admin',
    email,
    password
  };
  await Users.create(user, 'admin');
};

module.exports = {
  createAdmin
};
