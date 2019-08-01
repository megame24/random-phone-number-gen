const fs = require('fs');
const path = require('path');
const testStorePath = path.join(__dirname, '../../database/store/test/');

(() => {
  fs.readdir(testStorePath, (err, files) => {
    if (err) console.log(err);
    files.forEach((fileName) => {
      if (fileName === '.gitignore') return;
      fs.unlinkSync(path.join(__dirname, `../../database/store/test/${fileName}`));
    });
  });
})();
