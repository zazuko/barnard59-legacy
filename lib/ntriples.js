const rdf = require('rdf-ext')
const sinkToDuplex = require('./sinkToDuplex')
const N3Parser = require('rdf-parser-n3')
const NTriplesSerializer = require('rdf-serializer-ntriples')

function parse () {
  return sinkToDuplex(new N3Parser({factory: rdf}), {
    readableObjectMode: true
  })
}

function serialize () {
  return sinkToDuplex(new NTriplesSerializer(), {
    writableObjectMode: true
  })
}

module.exports = {
  parse: parse,
  serialize: serialize
}
