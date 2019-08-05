const fs = require('fs');
const uuidv4 = require('uuid/v4');
const config = require('../../configs/config');
const storePath = config[process.env.NODE_ENV].phoneNumbers;
const fileUtil = require('../../utils/fileUtil');
const { throwError } = require('../../helpers/errorHelper');
const UsersNumbers = require('./UsersNumbers');

/**
 * PhoneNumModel constructor
 * @returns {undefined}
 */
function PhoneNumModel() {}

/**
 * Create phone number
 * @param {Number} number phone number
 * @param {String} ownerId owner id
 * @returns {Number} the created phone number
 */
PhoneNumModel.prototype.create = (number, ownerId) => {
  return new Promise((resolve, reject) => {
    try {
      const numId = uuidv4();
      fileUtil.openFile(storePath, async (buf, fd, fileSize) => {
        // limit file size to 4mb
        if (fileSize > 4000000) throwError('Maximum file size exceeded');
        let phoneNumbers = {};
        if (buf.toString()) {
          phoneNumbers = JSON.parse(buf.toString());
        }
        if (phoneNumbers[number]) throwError('Phone number must be unique', 400);
        phoneNumbers[numId] = number;
        fs.writeSync(fd, JSON.stringify(phoneNumbers));
        resolve(phoneNumbers);
        // create a relationship between number and owner
        await UsersNumbers.create(numId, ownerId);
        fs.closeSync(fd);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Find all phone numbers
 * @param {Array} phoneNumIds an array of phone number ids
 * @param {String} sort (ASC/DESC)
 * @returns {Array} an array of phone numbers
 */
PhoneNumModel.prototype.findAll = (phoneNumIds = [], sort = 'asc') => {
  return new Promise((resolve, reject) => {
    try {
      fileUtil.openFile(storePath, (buf, fd) => {
        let phoneNumbers = [];
        if (buf.toString()) {
          const data = JSON.parse(buf.toString());
          if (phoneNumIds[0] === '*') {
            phoneNumbers = Object.values(data);
          } else {
            phoneNumIds.forEach((id) => {
              phoneNumbers.push(data[id]);
            });
          }
        }
        phoneNumbers = phoneNumbers.sort((a, b) => {
          if (sort.toLowerCase() === 'desc') return b - a;
          return a - b;
        });
        resolve(phoneNumbers);
        fs.closeSync(fd);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = new PhoneNumModel();
