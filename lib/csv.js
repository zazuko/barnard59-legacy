const CsvParser = require('csv-parse').Parser

function parse (options) {
  return new CsvParser(options)
}

module.exports = {
  parse: parse
}
