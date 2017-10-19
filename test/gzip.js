/* global describe, it */

const assert = require('assert')
const gzip = require('../lib/gzip')
const isDuplex = require('./support/isDuplex')
const toArray = require('./support/toArray')
const Readable = require('readable-stream')

describe('gzip', () => {
  it('should be a function', () => {
    assert.equal(typeof gzip, 'function')
  })

  it('should return a Duplex', () => {
    assert(isDuplex(gzip()))
  })

  it('should separate a array into chunks', () => {
    const input = new Readable({
      read: () => {
        input.push('test')
        input.push(null)
      }
    })

    return toArray(input.pipe(gzip())).then((result) => {
      const content = Buffer.concat(result)
      const expected = Buffer.from([
        0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x03, 0x2b, 0x49, 0x2d, 0x2e, 0x01, 0x00,
        0x0c, 0x7e, 0x7f, 0xd8, 0x04, 0x00, 0x00, 0x00
      ])

      assert.deepEqual(content, expected)
    })
  })
})
