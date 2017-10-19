const rdf = require('rdf-ext')
const sinkToDuplex = require('./sinkToDuplex')
const JsonLdParser = require('rdf-parser-jsonld')
const Readable = require('stream').Readable

function parse () {
  return sinkToDuplex(new JsonLdParser({factory: rdf}), {
    readableObjectMode: true
  })
}

parse.object = function (object) {
  const input = new Readable({
    objectMode: true,
    read: function () {
      this.push(JSON.stringify(object))
      this.push(null)
    }
  })

  const parser = new JsonLdParser({factory: rdf})

  return parser.import(input)
}

module.exports = {
  parse: parse
}
