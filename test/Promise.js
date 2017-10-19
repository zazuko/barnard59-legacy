/* global describe, it */

const assert = require('assert')
const isPromise = require('./support/isPromise')
const EventEmitter = require('events').EventEmitter
const Promise = require('../lib/Promise')

describe('Promise', () => {
  it('should be a Promise implementation', () => {
    assert(isPromise(Promise.resolve()))
  })

  describe('.serially', () => {
    it('should be a function', () => {
      assert.equal(typeof Promise.serially, 'function')
    })

    it('should run a function for each item of an array serially', () => {
      const input = ['0', '1', '2']

      let parallel = 0

      return Promise.serially(input, () => {
        parallel++

        assert.equal(parallel, 1)

        return Promise.delay(20).then(() => {
          parallel--
        })
      })
    })
  })

  describe('.on', () => {
    it('should be a function', () => {
      assert.equal(typeof Promise.on, 'function')
    })

    it('should resolve on when the defined event is emitted', () => {
      const obj = new EventEmitter()

      Promise.delay(20).then(() => {
        obj.emit('end')
      })

      return Promise.on(obj, 'end')
    })

    it('should forward the emitted data', () => {
      const obj = new EventEmitter()

      Promise.delay(20).then(() => {
        obj.emit('data', 'test')
      })

      return Promise.on(obj, 'data').then((result) => {
        assert.equal(result, 'test')
      })
    })

    describe('.on.reject', () => {
      it('should reject on when the defined event is emitted', () => {
        const obj = new EventEmitter()

        Promise.delay(20).then(() => {
          obj.emit('end')
        })

        return new Promise((resolve) => {
          Promise.on(obj, 'end').reject().catch(resolve)
        })
      })

      it('should forward the error', () => {
        const obj = new EventEmitter()

        Promise.delay(20).then(() => {
          obj.emit('end', new Error('test'))
        })

        return new Promise((resolve) => {
          Promise.on(obj, 'end').reject().catch(resolve)
        }).then((err) => {
          assert.equal(err.message, 'test')
        })
      })

      it('should create an empty error if the event doesn\'t emit an error', () => {
        const obj = new EventEmitter()

        Promise.delay(20).then(() => {
          obj.emit('end')
        })

        return new Promise((resolve) => {
          Promise.on(obj, 'end').reject().catch(resolve)
        }).then((err) => {
          assert.equal(typeof err.message, 'string')
        })
      })
    })
  })
})
