const { throwError } = require('../helpers/errorHelper');
const { PhoneNumbers } = require('../database/models');

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
  const { user: { id } } = req;
  try {
    // get the list of number
    const phoneNumbers = await PhoneNumbers.findAll();
    if (phoneNumbers.length > 10000) throwError('Maximum number of phone numbers exceeded');
    // generate random number and ensure it is unique by comparing to list
    let generatedNum = `0${Math.floor(Math.random() * 1000000000)}`;
    while (phoneNumbers.includes(generatedNum)) {
      generatedNum = `0${Math.floor(Math.random() * 1000000000)}`;
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
PhoneNumController.getPhoneNums = async (req, res, next) => {
  try {
    // get the list of number according to filter and sorting
    // return list of numbers
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
PhoneNumController.getPhoneNumsDetails = async (req, res, next) => {
  try {
    // get the list of number according to filter and sorting
    // get total from length
    // get min and max
    // return details
  } catch (err) {
    next(err);
  }
};

module.exports = PhoneNumController;
