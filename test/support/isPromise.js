function isPromise (promise) {
  return typeof promise.then === 'function'
}

module.exports = isPromise
