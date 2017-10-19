/* global describe, it */

const assert = require('assert')
const isReadable = require('./support/isReadable')
const isDuplex = require('./support/isDuplex')
const jsonld = require('../lib/jsonld')
const rdf = require('rdf-ext')
const toArray = require('./support/toArray')
const Readable = require('readable-stream')

describe('jsonld', () => {
  it('should be an object', () => {
    assert.equal(typeof jsonld, 'object')
  })

  describe('.parse', () => {
    it('should be a function', () => {
      assert.equal(typeof jsonld.parse, 'function')
    })

    it('should return a Duplex', () => {
      assert(isDuplex(jsonld.parse()))
    })

    it('should parse the JSON-LD string stream and return a quad stream', () => {
      const input = new Readable({
        objectMode: true,
        read: () => {
          input.push(JSON.stringify({
            '@id': 'http://example.org/subject',
            'http://example.org/predicate': 'object'
          }))
          input.push(null)
        }
      })

      return toArray(input.pipe(jsonld.parse())).then((result) => {
        const expected = rdf.dataset([rdf.quad(
          rdf.namedNode('http://example.org/subject'),
          rdf.namedNode('http://example.org/predicate'),
          rdf.literal('object')
        )])

        assert.equal(rdf.dataset(result).toCanonical(), expected.toCanonical())
      })
    })
  })

  describe('.parse.object', () => {
    it('should be a function', () => {
      assert.equal(typeof jsonld.parse.object, 'function')
    })

    it('should return a Readable', () => {
      assert(isReadable(jsonld.parse.object({})))
    })

    it('should parse the JSON-LD string and return a quad stream', () => {
      const input = {
        '@id': 'http://example.org/subject',
        'http://example.org/predicate': 'object'
      }

      return toArray(jsonld.parse.object(input)).then((result) => {
        const expected = rdf.dataset([rdf.quad(
          rdf.namedNode('http://example.org/subject'),
          rdf.namedNode('http://example.org/predicate'),
          rdf.literal('object')
        )])

        assert.equal(rdf.dataset(result).toCanonical(), expected.toCanonical())
      })
    })
  })
})
