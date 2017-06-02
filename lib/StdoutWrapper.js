const Transform = require('stream').Transform

class StdoutWrapper extends Transform {
  constructor (stream) {
    super({
      writableObjectMode: true
    })

    this.stream = stream || process.stdout

    this.resume()
  }

  _transform (data, encoding, callback) {
    if (!Buffer.isBuffer(data) && !(typeof data === 'string')) {
      data = JSON.stringify(data) + '\n'
    }

    this.stream.write(data, encoding, () => {
      this.push(data)

      callback()
    })
  }
}

module.exports = StdoutWrapper
