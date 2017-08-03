const Promise = require('bluebird')

function resolveOn (stream, event) {
  return new Promise((resolve) => {
    stream.on(event, () => {
      resolve()
    })
  })
}

function rejectOn (stream, event) {
  return new Promise((resolve, reject) => {
    stream.on(event, (err) => {
      reject(err)
    })
  })
}

function runStream (stream) {
  return Promise.race([
    resolveOn(stream, 'end'),
    resolveOn(stream, 'finish'),
    rejectOn(stream, 'err')
  ])
}

/**
 * Run a pipe.
 * @param {Stream} something
 * @return {Promise} something
 * @memberof module:barnard59
 * @example
 * ```js
 * p.run(source.pipe(p.limit).pipe(p.stdout())).then(() => {console.log('done')})
 * ```
 */
function run (something) {
  if (typeof something === 'function') {
    return Promise.resolve().then(() => {
      return something()
    })
  }

  if (something.readable || something.writable) {
    return runStream(something)
  }

  return Promise.reject(new Error('unknown content'))
}

module.exports = run
