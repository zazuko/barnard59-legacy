const Promise = require('../../lib/Promise')
const Writable = require('readable-stream').Writable

function toArray (stream, options) {
  options = options || {}

  const array = []

  const output = new Writable({
    objectMode: true,
    write: (chunk, encoding, callback) => {
      if (options.decode) {
        chunk = chunk.toString(encoding)
      }

      array.push(chunk)

      callback()
    }
  })

  stream.pipe(output)

  return Promise.race([
    Promise.on(output, 'finish').then(() => {
      return array
    }),
    Promise.on(stream, 'error').reject()
  ])
}

module.exports = toArray
