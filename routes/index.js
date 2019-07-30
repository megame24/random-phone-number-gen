const { Router } = require('express');
const users = require('./users');

const router = Router();
router.use('/api', users);

module.exports = router;
