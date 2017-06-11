const multipipe = require('multipipe')
const through = require('through2')
const LineStream = require('byline').LineStream

function byline () {
  return new LineStream()
}

byline.withNewLine = function () {
  return multipipe(byline(), through(function (chunk, encoding, callback) {
    this.push(chunk + '\n')

    callback()
  }))
}

module.exports = byline
