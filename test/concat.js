/* global describe, it */

const assert = require('assert')
const concat = require('../lib/concat')
const isDuplex = require('./support/isDuplex')
const toArray = require('./support/toArray')
const Promise = require('../lib/Promise')
const Readable = require('readable-stream')

describe('concat', () => {
  it('should be a function', () => {
    assert.equal(typeof concat, 'function')
  })

  it('should return null for unkown types', () => {
    assert(!concat(null))
  })

  describe('array', () => {
    it('should return a Duplex', () => {
      assert(isDuplex(concat([])))
    })

    it('should concat streams in array', () => {
      const streams = [
        new Readable({
          read: function () {
            this.push('0')
            this.push('1')
            this.push(null)
          }
        }),
        new Readable({
          read: function () {
            this.push('2')
            this.push(null)
          }
        })
      ]

      const stream = concat(streams)

      return toArray(stream, {decode: true}).then((result) => {
        assert.deepEqual(result, ['0', '1', '2'])
      })
    })

    it('should concat streams returned by functions in array', () => {
      const streams = [
        new Readable({
          read: function () {
            this.push('0')
            this.push('1')
            this.push(null)
          }
        }),
        new Readable({
          read: function () {
            this.push('2')
            this.push(null)
          }
        })
      ]

      const stream = concat(streams.map((s) => {
        return () => {
          return s
        }
      }))

      return toArray(stream, {decode: true}).then((result) => {
        assert.deepEqual(result, ['0', '1', '2'])
      })
    })
  })

  describe('iterator', () => {
    it('should return a Duplex', () => {
      assert(isDuplex(concat(() => {
        return null
      })))
    })

    it('should call the iterator function', () => {
      let touched = false

      const stream = concat(() => {
        touched = true

        return null
      })

      stream.resume()

      return Promise.on(stream, 'end').then(() => {
        assert(touched)
      })
    })

    it('should concat streams returned by iterator function', () => {
      const streams = [
        new Readable({
          read: function () {
            this.push('0')
            this.push('1')
            this.push(null)
          }
        }),
        new Readable({
          read: function () {
            this.push('2')
            this.push(null)
          }
        })
      ]

      const stream = concat(() => {
        return streams.shift()
      })

      return toArray(stream, {decode: true}).then((result) => {
        assert.deepEqual(result, ['0', '1', '2'])
      })
    })

    it('should concat streams returned by iterator function as Promise', () => {
      const streams = [
        new Readable({
          read: function () {
            this.push('0')
            this.push('1')
            this.push(null)
          }
        }),
        new Readable({
          read: function () {
            this.push('2')
            this.push(null)
          }
        })
      ]

      const stream = concat(() => {
        return Promise.resolve(streams.shift())
      })

      return toArray(stream, {decode: true}).then((result) => {
        assert.deepEqual(result, ['0', '1', '2'])
      })
    })

    it('should process iterator function in sequence', () => {
      let count = 0

      const streams = [
        new Readable({
          read: function () {
            this.push('0')
            this.push('1')
            this.push(null)
          }
        }),
        new Readable({
          read: function () {
            this.push('2')
            this.push(null)
          }
        })
      ]

      const stream = concat(() => {
        assert.equal(count, 0)

        count++

        return Promise.delay(20).then(() => {
          count--

          return streams.shift()
        })
      })

      return toArray(stream, {decode: true})
    })

    it('should forward iterator errors', () => {
      const stream = concat(() => {
        return Promise.reject(new Error())
      })

      stream.resume()

      return Promise.on(stream, 'error')
    })
  })

  describe('.object', () => {
    it('should process streams in object mode', () => {
      const streams = [
        new Readable({
          objectMode: true,
          read: function () {
            this.push('0')
            this.push('1')
            this.push(null)
          }
        }),
        new Readable({
          objectMode: true,
          read: function () {
            this.push('2')
            this.push(null)
          }
        })
      ]

      const stream = concat.object(streams)

      return toArray(stream).then((result) => {
        assert.deepEqual(result, ['0', '1', '2'])
      })
    })
  })

  describe('.map', () => {
    it('should be a function', () => {
      assert.equal(typeof concat.map, 'function')
    })

    it('should concat streams returned by the callback function', () => {
      const streams = [
        new Readable({
          read: function () {
            this.push('0')
            this.push('1')
            this.push(null)
          }
        }),
        new Readable({
          read: function () {
            this.push('2')
            this.push(null)
          }
        })
      ]

      const stream = concat.map(streams, (s) => {
        return s
      })

      return toArray(stream, {decode: true}).then((result) => {
        assert.deepEqual(result, ['0', '1', '2'])
      })
    })
  })

  describe('.map.object', () => {
    it('should be a function', () => {
      assert.equal(typeof concat.map, 'function')
    })

    it('should concat streams returned by the callback function in object mode', () => {
      const streams = [
        new Readable({
          objectMode: true,
          read: function () {
            this.push('0')
            this.push('1')
            this.push(null)
          }
        }),
        new Readable({
          objectMode: true,
          read: function () {
            this.push('2')
            this.push(null)
          }
        })
      ]

      const stream = concat.map.object(streams, (s) => {
        return s
      })

      return toArray(stream).then((result) => {
        assert.deepEqual(result, ['0', '1', '2'])
      })
    })
  })
})
