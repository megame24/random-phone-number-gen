const fs = require('fs');

function FileUtil() {}

FileUtil.prototype.openFile = (storePath, cb) => {
  let flag = 'w+';
  if (fs.existsSync(storePath)) flag = 'r+';
  fs.open(storePath, flag, (err, fd) => {
    const fileSize = fs.statSync(storePath).size;
    const buf = Buffer.alloc(fileSize);
    if (err) throw err;
    fs.readSync(fd, buf, 0, fileSize, 0);
    cb(buf, fd, fileSize);
  });
};

module.exports = new FileUtil();
