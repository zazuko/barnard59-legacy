const Transform = require('stream').Transform

class ResultToString extends Transform {
  constructor () {
    super({
      writableObjectMode: true
    })
  }

  _transform (chunk, encoding, callback) {
    this.push(JSON.stringify(Object.keys(chunk).reduce((row, key) => {
      const value = chunk[key]

      row[key] = value.toCanonical()

      return row
    }, {})) + '\n')

    callback()
  }
}

module.exports = ResultToString
