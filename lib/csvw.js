const rdf = require('rdf-ext')
const sinkToDuplex = require('./sinkToDuplex')
const CsvwParser = require('rdf-parser-csvw')

function parse (options) {
  options = options || {}
  options.factory = rdf

  return sinkToDuplex(new CsvwParser(options), {
    readableObjectMode: true
  })
}

module.exports = {
  parse: parse
}
