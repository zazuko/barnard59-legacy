/* global describe, it */

const assert = require('assert')
const csv = require('../lib/csv')
const isDuplex = require('./support/isDuplex')
const toArray = require('./support/toArray')
const Readable = require('readable-stream')

describe('csv', () => {
  it('should be an object', () => {
    assert.equal(typeof csv, 'object')
  })

  describe('.parse', () => {
    it('should be a function', () => {
      assert.equal(typeof csv.parse, 'function')
    })

    it('should return a Duplex', () => {
      isDuplex(csv.parse())
    })

    it('should parse CSV lines', () => {
      const input = new Readable({
        read: () => {
          input.push('key0,key1\n')
          input.push('value0a,value0b\n')
          input.push('value1a,value1b\n')
          input.push(null)
        }
      })

      return toArray(input.pipe(csv.parse({columns: true}))).then((result) => {
        assert.deepEqual(result, [{
          key0: 'value0a',
          key1: 'value0b'
        }, {
          key0: 'value1a',
          key1: 'value1b'
        }])
      })
    })
  })
})
