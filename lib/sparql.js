const SparqlClient = require('./SparqlClient')

function sparql (options) {
  return new SparqlClient(options)
}

sparql.selectQuery = function (options) {
  return sparql(options).selectQuery(options)
}

module.exports = sparql
