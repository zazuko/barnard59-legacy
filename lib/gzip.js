const zlib = require('zlib')

function gzip (options) {
  return zlib.createGzip(options)
}

module.exports = gzip
