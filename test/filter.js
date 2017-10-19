/* global describe, it */

const assert = require('assert')
const filter = require('../lib/filter')
const isDuplex = require('./support/isDuplex')
const toArray = require('./support/toArray')
const Readable = require('readable-stream')

describe('filter', () => {
  it('should be a function', () => {
    assert.equal(typeof filter, 'function')
  })

  it('should return a Duplex', () => {
    assert(isDuplex(filter()))
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

      input.pipe(filter(callback))
    })
  })

  it('should filter chunks based on callback return value', () => {
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push('0')
        input.push('1')
        input.push('2')
        input.push(null)
      }
    })

    const callback = (chunk) => {
      return chunk.toString() !== '1'
    }

    return toArray(input.pipe(filter(callback))).then((result) => {
      assert.deepEqual(result, ['0', '2'])
    })
  })

  it('should filter chunks based on callback Promise result', () => {
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push('0')
        input.push('1')
        input.push('2')
        input.push(null)
      }
    })

    const callback = (chunk) => {
      return Promise.resolve(chunk.toString() !== '1')
    }

    return toArray(input.pipe(filter(callback))).then((result) => {
      assert.deepEqual(result, ['0', '2'])
    })
  })
})
