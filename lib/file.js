const fs = require('fs')

module.exports = {
  read: (filename) => {
    return fs.createReadStream(filename)
  },

  write: (filename, options) => {
    options = options || {}
    options.highWaterMark = options.highWaterMark || 1048576

    return fs.createWriteStream(filename, options)
  }
}
