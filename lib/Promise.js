const Promise = require('bluebird')

Promise.serially = function (input, iterator) {
  const results = []

  return Promise.each(input, (item) => {
    return Promise.resolve().then(() => {
      return iterator(item)
    }).then((result) => {
      results.push(result)
    })
  }).then(() => {
    return results
  })
}

Promise.on = function (obj, event) {
  const promise = new Promise((resolve) => {
    obj.on(event, resolve)
  })

  // attach .reject function to Promise
  promise.reject = () => {
    return promise.then((err) => {
      return Promise.reject(err || new Error())
    })
  }

  return promise
}

module.exports = Promise
