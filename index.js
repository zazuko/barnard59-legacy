/**
 * barnard59 Linked Data pipelines
 * @module barnard59
 * @typicalname p
 * @example
 * ```js
 * var p = require('barnard59')
 * ```
 */

module.exports = {
  byline: require('./lib/byline'),
  concat: require('./lib/concat'),
  count: require('./lib/count'),
  csv: require('./lib/csv'),
  csvw: require('./lib/csvw'),
  file: require('./lib/file'),
  filter: require('./lib/filter'),
  flatten: require('./lib/flatten'),
  glob: require('./lib/glob'),
  gzip: require('./lib/gzip'),
  jsonld: require('./lib/jsonld'),
  limit: require('./lib/limit'),
  map: require('./lib/map'),
  ntriples: require('./lib/ntriples'),
  offset: require('./lib/offset'),
  rdf: require('rdf-ext'),
  run: require('./lib/run'),
/**
 * Execute a shell command.
 * @memberof module:barnard59
 */
  shell: require('shelljs'),
  speed: require('./lib/speed'),
/**
 * Provides a pipe which writes on the stdout of the current operating system process.
 * @method
 * @memberof module:barnard59
 */
  stdout: require('./lib/stdout'),
  sparql: require('./lib/sparql'),
  unzip: require('./lib/unzip'),
  Promise: require('./lib/Promise')
}
