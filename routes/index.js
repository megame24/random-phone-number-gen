const { Router } = require('express');
const users = require('./users');
const phoneNumbers = require('./phoneNumbers');

const router = Router();
router.use('/api', users);
router.use('/api', phoneNumbers);

module.exports = router;
