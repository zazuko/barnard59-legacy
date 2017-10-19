/* global afterEach, describe, it */

const assert = require('assert')
const file = require('../lib/file')
const fs = require('fs')
const isReadable = require('./support/isReadable')
const isWritable = require('./support/isWritable')
const path = require('path')
const toArray = require('./support/toArray')
const Promise = require('bluebird')

describe('file', () => {
  it('should be an object', () => {
    assert.equal(typeof file, 'object')
  })

  describe('.read', () => {
    const filepath = path.join(__dirname, 'support/dummy.txt')

    it('should be a function', () => {
      assert.equal(typeof file.read, 'function')
    })

    it('should return a Readable', () => {
      assert(isReadable(file.read(filepath)))
    })

    it('should return a stream which reads the file content', () => {
      return toArray(file.read(filepath)).then((chunks) => {
        assert.equal(chunks.join(''), 'test')
      })
    })
  })

  describe('.write', () => {
    const filepath = path.join(__dirname, 'support/tmp.txt')

    afterEach(() => {
      return new Promise((resolve) => {
        fs.unlink(filepath, resolve)
      })
    })

    it('should be a function', () => {
      assert.equal(typeof file.write, 'function')
    })

    it('should return a Writable', () => {
      assert(isWritable(file.write(filepath)))
    })

    it('should write the content to the file', () => {
      const writable = file.write(filepath)

      writable.end('test')

      return Promise.promisify(fs.readFile)(filepath).then((content) => {
        assert.equal(content, 'test')
      })
    })
  })
})
