const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const PhoneNumController = require('../controllers/PhoneNumController');

const { authenticateUser } = authMiddleware;
const { generatePhoneNum} = PhoneNumController;

const router = Router();

router.post(
  '/phoneNumbers',
  authenticateUser,
  generatePhoneNum
);

// router.get(
//   '/phoneNumbers',
// );

// router.get(
//   '/phoneNumbers/details'
// );

module.exports = router;
