/* global describe, it */

const assert = require('assert')
const isPromise = require('./support/isPromise')
const run = require('../lib/run')
const Promise = require('../lib/Promise')
const Readable = require('readable-stream')
const Writable = require('readable-stream').Writable

describe('run', () => {
  it('should be a function', () => {
    assert.equal(typeof run, 'function')
  })

  it('should return a Promise', () => {
    assert(isPromise(run(() => {})))
  })

  it('should run the given function', () => {
    let touched = false

    const callback = () => {
      touched = true
    }

    return run(callback).then(() => {
      assert(touched)
    })
  })

  it('should run the given function and wait for the Promise', () => {
    let touched = false

    const callback = () => {
      return Promise.delay(20).then(() => {
        touched = true
      })
    }

    return run(callback).then(() => {
      assert(touched)
    })
  })

  it('should wait for the end of the given readable stream', () => {
    const input = new Readable({
      read: () => {
        input.push(null)
      }
    })

    Promise.delay(20).then(() => {
      input.resume()
    })

    return run(input)
  })

  it('should wait for finish of the given writable stream', () => {
    const input = new Writable({
      write: (chunk, encoding, callback) => {
        callback()
      }
    })

    Promise.delay(20).then(() => {
      input.end()
    })

    return run(input)
  })

  it('should reject on error', () => {
    const input = new Readable({
      read: () => {
        input.emit('error', new Error())
      }
    })

    Promise.delay(20).then(() => {
      input.resume()
    })

    return new Promise((resolve) => {
      run(input).catch(resolve)
    })
  })
})
