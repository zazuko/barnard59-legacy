/* global describe, it */

const assert = require('assert')
const isDuplex = require('./support/isDuplex')
const ntriples = require('../lib/ntriples')
const rdf = require('rdf-ext')
const toArray = require('./support/toArray')
const Readable = require('readable-stream')

describe('ntriples', () => {
  it('should be an object', () => {
    assert.equal(typeof ntriples, 'object')
  })

  describe('.parse', () => {
    it('should be a function', () => {
      assert.equal(typeof ntriples.parse, 'function')
    })

    it('should return a Duplex', () => {
      assert(isDuplex(ntriples.parse()))
    })

    it('should parse the N-Triples string stream and return a quad stream', () => {
      const input = new Readable({
        objectMode: true,
        read: () => {
          input.push('<http://example.org/subject> <http://example.org/predicate> "object" .')
          input.push(null)
        }
      })

      return toArray(input.pipe(ntriples.parse())).then((result) => {
        const expected = rdf.dataset([rdf.quad(
          rdf.namedNode('http://example.org/subject'),
          rdf.namedNode('http://example.org/predicate'),
          rdf.literal('object')
        )])

        assert.equal(rdf.dataset(result).toCanonical(), expected.toCanonical())
      })
    })
  })

  describe('serialize', () => {
    it('should be a function', () => {
      assert.equal(typeof ntriples.serialize, 'function')
    })

    it('should return a Duplex', () => {
      assert(isDuplex(ntriples.serialize()))
    })

    it('should serialize the quad stream and return N-Triples string stream', () => {
      const input = new Readable({
        objectMode: true,
        read: () => {
          input.push(rdf.quad(
            rdf.namedNode('http://example.org/subject'),
            rdf.namedNode('http://example.org/predicate'),
            rdf.literal('object')
          ))
          input.push(null)
        }
      })

      return toArray(input.pipe(ntriples.serialize())).then((result) => {
        const expected = '<http://example.org/subject> <http://example.org/predicate> "object" .\n'

        assert.equal(Buffer.concat(result).toString(), expected)
      })
    })
  })
})
