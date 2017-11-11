const duplexify = require('duplexify')
const Duplex = require('stream').Duplex

class PassThrough extends Duplex {
  constructor (options) {
    super({
      allowHalfOpen: false,
      objectMode: options.objectMode
    })

    this.on('finish', () => {
      this.emit('end')
    })
  }

  _write (chunk, encoding, callback) {
    this.push(chunk)
    callback()
  }

  _read () {
  }
}

function sinkToDuplex (sink, options) {
  options = options || {}

  const input = new PassThrough({
    objectMode: options.writableObjectMode
  })

  const output = sink.import(input)

  const duplex = duplexify(input, output, options)

  return duplex
}

module.exports = sinkToDuplex
