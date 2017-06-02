const duplexify = require('duplexify')
const PassThrough = require('stream').PassThrough

function sinkToDuplex (sink, options) {
  options = options || {}

  const input = new PassThrough({
    objectMode: options.writableObjectMode
  })

  const output = sink.import(input)

  return duplexify(input, output, options)
}

module.exports = sinkToDuplex
