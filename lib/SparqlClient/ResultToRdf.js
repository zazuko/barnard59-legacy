const rdf = require('rdf-ext')
const Transform = require('stream').Transform

class ResultToRdf extends Transform {
  constructor () {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    })
  }

  _transform (chunk, encoding, callback) {
    this.push(Object.keys(chunk).reduce((row, key) => {
      const value = chunk[key]

      if (value.type === 'uri') {
        row[key] = rdf.namedNode(value.value)
      } else if (value.type === 'literal') {
        let datatype

        if (value.datatype) {
          datatype = rdf.namedNode(value.datatype)
        }

        row[key] = rdf.literal(value.value, datatype)
      }

      return row
    }, {}))

    callback()
  }
}

module.exports = ResultToRdf
