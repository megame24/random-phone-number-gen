const { throwError } = require('../helpers/errorHelper');
const { PhoneNumbers, UsersNumbers } = require('../database/models');
const { generateRandomNum } = require('../helpers/numberHelper');

/**
 * PhoneNumController constructor
 * @returns {undefined}
 */
function PhoneNumController() { }

/**
 * Generate phone number controller
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next function in the
 * middleware chain
 * @returns {Object} response object
 */
PhoneNumController.generatePhoneNum = async (req, res, next) => {
  try {
    const { user: { id } } = req;
    // get the list of number
    const phoneNumbers = await PhoneNumbers.findAll();
    if (phoneNumbers.length > 10000) throwError('Maximum number of phone numbers exceeded');
    // generate random number and ensure it is unique by comparing to list
    let generatedNum = `0${generateRandomNum(9)}`;
    // fixx
    while (phoneNumbers.includes(generatedNum)) {
      generatedNum = `0${generateRandomNum(9)}`;
    }
    // save number and link to owner, ensure limit of 10000/4mb isn't exceeded
    await PhoneNumbers.create(generatedNum, id);
    // return number
    res.status(201).json({
      phoneNumber: generatedNum
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get phone numbers controller
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next function in the
 * middleware chain
 * @returns {Object} response object
 */
PhoneNumController.getPhoneNumbers = async (req, res, next) => {
  try {
    const { user: { id, role } } = req;
    const { sort } = req.query;
    let phoneNumIds = await UsersNumbers.getPhoneNumIds(id);
    if (role === 'admin') phoneNumIds = ['*'];
    // get the list of number according to filter and sorting
    const phoneNumbers = await PhoneNumbers.findAll(phoneNumIds, sort);
    // return list of numbers
    res.status(200).json(phoneNumbers);
  } catch (err) {
    next(err);
  }
};

/**
 * Get phone numbers details controller
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next function in the
 * middleware chain
 * @returns {Object} response object
 */
PhoneNumController.getPhoneNumbersDetails = async (req, res, next) => {
  try {
    const { user: { role } } = req;
    if (role !== 'admin') throwError('Permission denied', 403);
    const phoneNumIds = ['*'];
    // get the list of number according to filter and sorting
    const phoneNumbers = await PhoneNumbers.findAll(phoneNumIds);
    // get total from length
    const phoneNumbersLength = phoneNumbers.length;
    // get min and max
    const minNumber = phoneNumbers[0];
    const maxNumber = phoneNumbers[phoneNumbersLength - 1];
    // return details
    res.status(200).json({
      phoneNumbersLength,
      minNumber,
      maxNumber
    });
  } catch (err) {
    next(err);
  }
};

module.exports = PhoneNumController;
