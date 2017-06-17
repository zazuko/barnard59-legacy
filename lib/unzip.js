const yauzl = require('yauzl')
const EventEmitter = require('events').EventEmitter
const PassThrough = require('stream').PassThrough
const Promise = require('bluebird')

function unzip (filename, options) {
  options = options || {}
  options.lazyEntries = typeof options.lazyEntries === 'undefined' ? true : options.lazyEntries

  const events = new EventEmitter()

  Promise.promisify(yauzl.open, {context: yauzl})(filename, options).then((zip) => {
    zip.on('entry', (entry) => {
      // directory
      if (/\/$/.test(entry.fileName)) {
        return
      }

      Promise.promisify(zip.openReadStream, {context: zip})(entry).then((stream) => {
        stream.once('end', () => {
          zip.readEntry()
        })

        events.emit('file', stream, entry)
      })
    })

    zip.once('end', () => {
      events.emit('end')
    })

    zip.once('error', (err) => {
      events.emit('error', err)
    })

    zip.readEntry()
  })

  // TODO:
  events.readable = true

  return events
}

unzip.file = function (zipFilename, filename, options) {
  const passThrough = new PassThrough()

  unzip(zipFilename, options)
    .on('file', (stream, entry) => {
      if (entry.fileName === filename) {
        stream.pipe(passThrough)
      } else {
        stream.resume()
      }
    })

  return passThrough
}

unzip.listFiles = function (filename, options) {
  return new Promise((resolve, reject) => {
    const filenames = []

    unzip(filename, options)
      .on('file', (stream, entry) => {
        stream.resume()

        filenames.push(entry.fileName)
      })
      .on('end', () => {
        resolve(filenames)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

module.exports = unzip
