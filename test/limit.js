/* global describe, it */

const assert = require('assert')
const isDuplex = require('./support/isDuplex')
const limit = require('../lib/limit')
const toArray = require('./support/toArray')
const Readable = require('readable-stream')

describe('limit', () => {
  it('should be a function', () => {
    assert.equal(typeof limit, 'function')
  })

  it('should return a Duplex', () => {
    assert(isDuplex(limit()))
  })

  it('should forward chunks until limit is reached', () => {
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push('0')
        input.push('1')
        input.push('2')
        input.push(null)
      }
    })

    return toArray(input.pipe(limit(2))).then((result) => {
      assert.deepEqual(result, ['0', '1'])
    })
  })
})
