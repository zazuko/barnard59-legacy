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

module.exports = Promise
