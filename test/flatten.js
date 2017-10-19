/* global describe, it */

const assert = require('assert')
const flatten = require('../lib/flatten')
const isDuplex = require('./support/isDuplex')
const toArray = require('./support/toArray')
const Readable = require('readable-stream')

describe('flatten', () => {
  it('should be a function', () => {
    assert.equal(typeof flatten, 'function')
  })

  it('should return a Duplex', () => {
    assert(isDuplex(flatten()))
  })

  it('should separate a array into chunks', () => {
    const input = new Readable({
      objectMode: true,
      read: () => {
        input.push(['0', '1'])
        input.push(['2'])
        input.push(null)
      }
    })

    return toArray(input.pipe(flatten())).then((result) => {
      assert.deepEqual(result, ['0', '1', '2'])
    })
  })
})
