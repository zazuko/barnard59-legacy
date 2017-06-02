const fs = require('fs')

module.exports = {
  read: (filename) => {
    return fs.createReadStream(filename)
  },

  write: (filename) => {
    return fs.createWriteStream(filename)
  }
}
