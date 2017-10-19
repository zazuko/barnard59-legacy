/* global describe, it */

const assert = require('assert')
const count = require('../lib/count')
const isDuplex = require('./support/isDuplex')
const Promise = require('../lib/Promise')
const Readable = require('readable-stream')

describe('count', () => {
  it('should be a function', () => {
    assert.equal(typeof count, 'function')
  })

  it('should return a Duplex', () => {
    isDuplex(count())
  })

  it('should count the number of chunks', () => {
    const input = new Readable({
      read: () => {
        input.push('0')
        input.push('1')
        input.push(null)
      }
    })

    const transform = count()

    input.pipe(transform)

    return Promise.on(transform, 'finish').then(() => {
      assert.equal(transform.count, 2)
    })
  })
})
