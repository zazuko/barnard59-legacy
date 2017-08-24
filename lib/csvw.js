const rdf = require('rdf-ext')
const sinkToDuplex = require('./sinkToDuplex')
const CsvwParser = require('rdf-parser-csvw')
const XlsxParser = require('rdf-parser-csvw-xlsx')

function parse (options) {
  options = options || {}
  options.factory = rdf

  return sinkToDuplex(new CsvwParser(options), {
    readableObjectMode: true
  })
}

function parseXlsx (options) {
  options = options || {}
  options.factory = rdf

  return sinkToDuplex(new XlsxParser(options), {
    readableObjectMode: true
  })
}

module.exports = {
  parse: parse,
  xlsx: {
    parse: parseXlsx
  }
}
