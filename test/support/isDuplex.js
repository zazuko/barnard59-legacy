function isDuplex (transform) {
  return transform.readable && transform.writable
}

module.exports = isDuplex
