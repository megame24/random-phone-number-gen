const generateRandomNum = (length) => {
  const lengthFactor = 1 * Math.pow(10, length);
  let generatedNum = Math.floor(Math.random() * lengthFactor);
  const numLengthDiff = 10 - generatedNum;
  if (numLengthDiff) {
    for (let i = 0; i < numLengthDiff; i++) {
      generatedNum += '0';
    }
  }
  return generatedNum;
};

module.exports = {
  generateRandomNum
};
