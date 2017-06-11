const globRaw = require('glob')
const Promise = require('bluebird')

const glob = Promise.promisify(globRaw)

module.exports = glob
