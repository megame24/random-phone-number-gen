const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const PhoneNumController = require('../controllers/PhoneNumController');

const { authenticateUser } = authMiddleware;
const { generatePhoneNum, getPhoneNumbers, getPhoneNumbersDetails } = PhoneNumController;

const router = Router();

router.post(
  '/phoneNumbers',
  authenticateUser,
  generatePhoneNum
);

router.get(
  '/phoneNumbers',
  authenticateUser,
  getPhoneNumbers
);

router.get(
  '/phoneNumbers/details',
  authenticateUser,
  getPhoneNumbersDetails
);

module.exports = router;
