/* global describe, it */

const assert = require('assert')
const isDuplex = require('./support/isDuplex')
const toArray = require('./support/toArray')
const Promise = require('../lib/Promise')
const StdoutWrapper = require('../lib/StdoutWrapper')
const Writable = require('readable-stream').Writable

describe('StdoutWrapper', () => {
  it('should be a constructor', () => {
    assert.equal(typeof StdoutWrapper, 'function')
  })

  it('should return a Duplex', () => {
    assert(isDuplex(new StdoutWrapper()))
  })

  it('should switch flow mode', () => {
    const wrapped = new StdoutWrapper()

    assert(wrapped._readableState.flowing)
  })

  it('should forward string chunks', () => {
    const result = []

    const stream = new Writable({
      write: (chunk, encoding, callback) => {
        result.push(chunk.toString())

        callback()
      }
    })

    const wrapped = new StdoutWrapper(stream)

    wrapped.write('0')
    wrapped.write('1')

    return Promise.promisify(wrapped.end, {context: wrapped})().then(() => {
      assert.deepEqual(result, ['0', '1'])
    })
  })

  it('should stringify objects', () => {
    const result = []

    const stream = new Writable({
      write: (chunk, encoding, callback) => {
        result.push(chunk.toString())

        callback()
      }
    })

    const wrapped = new StdoutWrapper(stream)

    wrapped.write({a: '0'})
    wrapped.write({b: '1'})

    return Promise.promisify(wrapped.end, {context: wrapped})().then(() => {
      assert.deepEqual(result, ['{"a":"0"}\n', '{"b":"1"}\n'])
    })
  })

  it('should pass through the chunks', () => {
    const stream = new Writable({
      write: (chunk, encoding, callback) => {
        callback()
      }
    })

    const wrapped = new StdoutWrapper(stream)

    Promise.delay(20).then(() => {
      wrapped.write('0')
      wrapped.write('1')
      wrapped.end()
    })

    return toArray(wrapped, {decode: true}).then((result) => {
      assert.deepEqual(result, ['0', '1'])
    })
  })
})
