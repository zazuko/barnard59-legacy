/* global describe, it */

const assert = require('assert')
const map = require('../lib/map')
const isDuplex = require('./support/isDuplex')
const toArray = require('./support/toArray')
const Readable = require('readable-stream')

describe('map', () => {
  it('should be a function', () => {
    assert.equal(typeof map, 'function')
  })

  it('should return a Duplex', () => {
    assert(isDuplex(map()))
  })

  it('should forward chunk and encoding to callback', () => {
    const input = new Readable({
      read: () => {
        input.push('0')
        input.push(null)
      }
    })

    return new Promise((resolve) => {
      const callback = (chunk, encoding) => {
        assert.equal(chunk, '0')
        assert.equal(encoding, 'utf8')

        resolve()
      }

      input.pipe(map(callback))
    })
  })

  it('should map chunks based on callback return value', () => {
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push('0')
        input.push('1')
        input.push(null)
      }
    })

    const callback = (chunk) => {
      return '0' + chunk.toString()
    }

    return toArray(input.pipe(map(callback))).then((result) => {
      assert.deepEqual(result, ['00', '01'])
    })
  })

  it('should map chunks based on callback Promise result', () => {
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push('0')
        input.push('1')
        input.push(null)
      }
    })

    const callback = (chunk) => {
      return Promise.resolve('0' + chunk.toString())
    }

    return toArray(input.pipe(map(callback))).then((result) => {
      assert.deepEqual(result, ['00', '01'])
    })
  })
})
