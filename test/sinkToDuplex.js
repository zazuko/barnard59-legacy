/* global describe, it */

const assert = require('assert')
const isDuplex = require('./support/isDuplex')
const sinkToDuplex = require('../lib/sinkToDuplex')
const toArray = require('./support/toArray')
const PassThrough = require('readable-stream').PassThrough

describe('sinkToDuplex', () => {
  it('should be a function', () => {
    assert.equal(typeof sinkToDuplex, 'function')
  })

  it('should return a Duplex', () => {
    const sink = {
      import: () => {}
    }

    assert(isDuplex(sinkToDuplex(sink)))
  })

  it('should provide the Writable interface using a PassThrough', () => {
    const sink = {
      import: (input) => {
        assert(isDuplex(input))
      }
    }

    sinkToDuplex(sink)
  })

  it('should forward the Writable object mode', () => {
    const sink = {
      import: (input) => {
        assert(input._writableState.objectMode)
      }
    }

    sinkToDuplex(sink, {
      writableObjectMode: true
    })
  })

  it('should use the stream returned by .import for the Duplex', () => {
    const sink = {
      import: (input) => {
        const output = new PassThrough()

        input.pipe(output)

        return output
      }
    }

    const duplex = sinkToDuplex(sink, {
      writableObjectMode: true
    })

    duplex.write('0')
    duplex.write('1')
    duplex.end()

    return toArray(duplex, {decode: true}).then((result) => {
      assert.deepEqual(result, ['0', '1'])
    })
  })
})
