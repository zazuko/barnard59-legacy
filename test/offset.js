/* global describe, it */

const assert = require('assert')
const isDuplex = require('./support/isDuplex')
const offset = require('../lib/offset')
const toArray = require('./support/toArray')
const Readable = require('readable-stream')

describe('offset', () => {
  it('should be a function', () => {
    assert.equal(typeof offset, 'function')
  })

  it('should return a Duplex', () => {
    assert(isDuplex(offset()))
  })

  it('should forward chunks after offset is reached', () => {
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push('0')
        input.push('1')
        input.push('2')
        input.push(null)
      }
    })

    return toArray(input.pipe(offset(2))).then((result) => {
      assert.deepEqual(result, ['2'])
    })
  })
})
