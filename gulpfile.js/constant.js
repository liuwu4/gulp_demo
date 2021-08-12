const path = require('path');
module.exports = {
  root: process.env.PWD,
  prefix: function (url) {
    return path.join(process.env.PWD, url);
  },
};
