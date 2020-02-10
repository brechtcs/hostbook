var { base32 } = require('rfc4648')
var { getter } = require('stdprop')
var Base = require('stdopt/base')
var crypto = require('crypto')

function Key (k) {
  if (this instanceof Key) Base.call(this, k)
  else return new Key(k)
}

Key.parse = function (k) {
  if (!k) return
  if (k.asymmetricKeyType === 'ed25519' && k.type === 'public') {
    return k
  }

  try {
    return crypto.createPublicKey({
      key: k,
      format: Buffer.isBuffer(k) ? 'der' : 'pem',
      type: 'spki'
    })
  } catch (err) {
    return err
  }
}

Key.prototype.toString = function () {
  return base32.stringify(this.buffer.slice(-32), { pad: false })
}

getter(Key.prototype, 'buffer', function () {
  return this.use(function (err, k) {
    if (err) throw err
    return k.export({ format: 'der', type: 'spki' })
  })
})

getter(Key.prototype, 'pem', function () {
  return this.use(function (err, k) {
    if (err) throw err
    return k.export({ format: 'pem', type: 'spki' })
  })
})

module.exports = Key