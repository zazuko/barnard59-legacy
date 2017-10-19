/* global describe, it */

const assert = require('assert')
const byline = require('../lib/byline')
const isDuplex = require('./support/isDuplex')
const toArray = require('./support/toArray')
const Readable = require('readable-stream')

describe('byline', () => {
  it('should be a function', () => {
    assert.equal(typeof byline, 'function')
  })

  it('should return a Duplex', () => {
    assert(isDuplex(byline()))
  })

  it('should split chunks by new line and keep the new line char', () => {
    const input = new Readable({
      read: () => {
        input.push('line0\nline1\n')
        input.push(null)
      }
    })

    return toArray(input.pipe(byline()), {decode: true}).then((result) => {
      assert.deepEqual(result, ['line0', 'line1'])
    })
  })

  describe('.withNewLine', () => {
    it('should be a function', () => {
      assert.equal(typeof byline.withNewLine, 'function')
    })

    it('should return a Duplex', () => {
      assert(isDuplex(byline.withNewLine()))
    })

    it('should split chunks by new line and keep the new line char', () => {
      const input = new Readable({
        read: () => {
          input.push('line0\nline1\n')
          input.push(null)
        }
      })

      return toArray(input.pipe(byline.withNewLine()), {decode: true}).then((result) => {
        assert.deepEqual(result, ['line0\n', 'line1\n'])
      })
    })
  })
})
