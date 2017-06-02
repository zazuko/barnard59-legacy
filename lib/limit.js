const through = require('through2')

function limit (limit) {
  const t = through.obj(function (chunk, encoding, callback) {
    t.count++

    if (t.count <= t.limit) {
      this.push(chunk)
    }

    callback()
  })

  t.limit = limit
  t.count = 0

  return t
}

module.exports = limit
