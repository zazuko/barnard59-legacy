const through = require('through2')

function count () {
  const t = through.obj(function (chunk, encoding, callback) {
    this.push(chunk)

    t.count++

    callback()
  })

  t.count = 0

  t.resume()

  return t
}

module.exports = count
