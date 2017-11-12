const through = require('through2')

function size () {
  let bytes = 0
  let lastBytes = 0

  const update = () => {
    if (bytes) {
      if (lastBytes === bytes) {
        return
      }

      let number = bytes
      let unit = 'bytes'

      if (number > 1024) {
        number /= 1024
        unit = 'kb'
      }

      if (number > 1024) {
        number /= 1024
        unit = 'mb'
      }

      if (number > 1024) {
        number /= 1024
        unit = 'gb'
      }

      const str = (Math.floor(number * 100) / 100) + ' ' + unit

      lastBytes = bytes

      process.stdout.cursorTo(0)
      process.stdout.write(str)
      process.stdout.clearLine(1)
    }

    setTimeout(update, 1000)
  }

  update()

  return through.obj(function (chunk, encoding, callback) {
    this.push(chunk)

    bytes += chunk.length

    callback()
  })
}

module.exports = size
