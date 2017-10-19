/* global describe, it */

const assert = require('assert')
const csvw = require('../lib/csvw')
const fs = require('fs')
const isDuplex = require('./support/isDuplex')
const jsonld = require('../lib/jsonld')
const ntriples = require('../lib/ntriples')
const path = require('path')
const rdf = require('rdf-ext')
const toArray = require('./support/toArray')

describe('csvw', () => {
  it('should be an object', () => {
    assert.equal(typeof csvw, 'object')
  })

  describe('.parse', () => {
    it('should be a function', () => {
      assert.equal(typeof csvw.parse, 'function')
    })

    it('should return a Duplex', () => {
      isDuplex(csvw.parse())
    })

    it('should parse CSV lines', () => {
      const inputPath = path.join(__dirname, 'support/csvw/input.csv')
      const metadataPath = path.join(__dirname, 'support/csvw/input.csv-metadata.json')
      const outputPath = path.join(__dirname, 'support/csvw/output.nt')

      return Promise.all([
        toArray(fs.createReadStream(metadataPath).pipe(jsonld.parse())).then((quads) => {
          return toArray(fs.createReadStream(inputPath).pipe(csvw.parse({
            baseIRI: 'http://example.org/',
            metadata: rdf.graph(quads)
          })))
        }),
        toArray(fs.createReadStream(outputPath).pipe(ntriples.parse()))
      ]).then((results) => {
        const actual = rdf.graph(results[0])
        const expected = rdf.graph(results[1])

        assert.equal(actual.toCanonical(), expected.toCanonical())
      })
    })
  })
})
