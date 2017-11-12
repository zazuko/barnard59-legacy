const through = require('through2')

function speed (label) {
  let count = 0
  let lastCount = 0

  const update = () => {
    if (count) {
      if (lastCount === count) {
        return
      }

      const str = (count - lastCount) + ' ' + label + ' per second'

      lastCount = count

      process.stdout.cursorTo(0)
      process.stdout.write(str)
      process.stdout.clearLine(1)
    }

    setTimeout(update, 1000)
  }

  update()

  return through.obj(function (chunk, encoding, callback) {
    this.push(chunk)

    count++

    callback()
  })
}

module.exports = speed
