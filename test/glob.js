/* global describe, it */

const assert = require('assert')
const glob = require('../lib/glob')
const isPromise = require('./support/isPromise')
const path = require('path')

describe('glob', () => {
  const globpattern = path.join(__dirname, 'support/**')

  it('should be a function', () => {
    assert.equal(typeof glob, 'function')
  })

  it('should return a Promise', () => {
    assert(isPromise(glob(globpattern)))
  })

  it('should return a result which contains all folders and files', () => {
    return glob(globpattern).then((files) => {
      const contains = (part) => {
        return files.some((file) => {
          return file.indexOf(part) !== -1
        })
      }

      assert(contains('input.csv'))
      assert(contains('dummy.txt'))
    })
  })
})
