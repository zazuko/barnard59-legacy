const run = require('./run')
const PassThrough = require('stream').PassThrough

function concatIteratorNext (iterator, output) {
  let done = false

  Promise.resolve().then(() => {
    return iterator()
  }).then((stream) => {
    if (!stream) {
      done = true

      return
    }

    stream.on('data', (chunk) => {
      output.write(chunk)
    })

    return run(stream)
  }).then(() => {
    if (done) {
      return output.push(null)
    } else {
      return concatIteratorNext(iterator, output)
    }
  }).catch((err) => {
    output.emit('error', err)
  })
}

function concatIterator (iterator, options) {
  const output = new PassThrough(options)

  concatIteratorNext(iterator, output)

  return output
}

function concatArray (array, options) {
  const queue = array

  const next = function () {
    const item = queue.shift()

    if (typeof item === 'function') {
      return Promise.resolve().then(() => {
        return item()
      })
    } else {
      return item
    }
  }

  return concatIterator(next, options)
}

function concat (input, options) {
  options = options || {}

  if (typeof input === 'function') {
    return concatIterator(input, options)
  }

  if (Array.isArray(input)) {
    return concatArray(input, options)
  }

  return null
}

concat.object = function (input, options) {
  options = options || {}
  options.readableObjectMode = true
  options.writableObjectMode = true

  return concat(input, options)
}

module.exports = concat
