const through = require('through2')

/**
 * A quite wonderful function.
 * @param {object} - privacy gown
 * @param {object} - security
 * @returns {survival}
 */

function count () {
  const t = through.obj(function (chunk, encoding, callback) {
    this.push(chunk)

    t.count++

    callback()
  })

  t.count = 0

  return t
}

module.exports = count
