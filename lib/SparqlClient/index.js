const fs = require('fs')
const nodeFetch = require('node-fetch')
const JSONStream = require('JSONStream')
const PassThrough = require('stream').PassThrough
const SparqlHttpClient = require('sparql-http-client')
const ResultToRdf = require('./ResultToRdf')

function promiseStreamNow (promise, options) {
  const stream = new PassThrough(options)

  promise.then((result) => {
    result.pipe(stream)
  }).catch((err) => {
    stream.emit('error', err)
  })

  return stream
}

class SparqlClient {
  constructor (options) {
    this.client = new SparqlHttpClient({
      endpointUrl: options.endpointUrl,
      fetch: options.fetch || nodeFetch
    })
  }

  selectQuery (options) {
    let query = options.query || fs.readFileSync(options.queryFile).toString()

    if (options.offset) {
      query += ' OFFSET ' + options.offset
    }

    if (options.limit) {
      query += ' LIMIT ' + options.limit
    }

    return promiseStreamNow(this.client.selectQuery(query).then((result) => {
      return result.body.pipe(JSONStream.parse('results.bindings.*')).pipe(new ResultToRdf())
    }), {
      objectMode: true
    })
  }
}

module.exports = SparqlClient
