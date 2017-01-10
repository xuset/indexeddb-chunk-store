module.exports = IdbChunkStore

var IdbKvStore = require('idb-kv-store')

function IdbChunkStore (chunkLength, opts, cb) {
  var self = this
  if (typeof chunkLength !== 'number') throw new Error('chunkLength must be a number')
  if (typeof opts === 'function') return IdbChunkStore(chunkLength, null, opts)
  if (!(self instanceof IdbChunkStore)) return new IdbChunkStore(chunkLength, opts, cb)
  if (!opts) opts = {}

  self.chunkLength = chunkLength
  self.length = Number(opts.length) || Infinity

  if (self.length !== Infinity) {
    this.lastChunkLength = (this.length % this.chunkLength) || this.chunkLength
    self.lastChunkIndex = Math.ceil(self.length / self.chunkLength) - 1
  }

  var name = opts.name || '' + Math.round(9e16 * Math.random())
  // for webtorrent
  if (opts.torrent && opts.torrent.infoHash) name = opts.torrent.infoHash
  self._store = new IdbKvStore(name, cb)
}

IdbChunkStore.prototype.put = function (index, buffer, cb) {
  var self = this
  if (!cb) cb = noop
  if (!self._store) throw new Error('Store is closed')
  if (typeof index !== 'number') throw new Error('index must be a number')
  if (!Buffer.isBuffer(buffer)) buffer = new Buffer(buffer)

  var isLastChunk = (index === self.lastChunkIndex)
  var badLength = (isLastChunk && buffer.length !== self.lastChunkLength) ||
                  (!isLastChunk && buffer.length !== self.chunkLength)
  if (badLength) return process.nextTick(cb, new Error('Invalid buffer length'))

  self._store.set(index, buffer, cb)
}

IdbChunkStore.prototype.get = function (index, opts, cb) {
  var self = this
  if (typeof opts === 'function') return self.get(index, null, opts)
  if (typeof cb !== 'function') throw new Error('cb must be a function')
  if (!self._store) throw new Error('Store is closed')
  if (typeof index !== 'number') throw new Error('index must be a number')
  if (!opts) opts = {}

  self._store.get(index, function (err, buffer) {
    if (err) return cb(err)
    if (typeof buffer === 'undefined') return cb(new Error('Chunk does not exist'))
    var offset = 'offset' in opts ? opts.offset : 0
    var length = 'length' in opts ? opts.length : buffer.length - offset
    cb(null, (new Buffer(buffer)).slice(offset, offset + length))
  })
}

IdbChunkStore.prototype.close = function (cb) {
  if (!cb) cb = noop
  if (this._store) this._store.close()
  this._store = null
  process.nextTick(cb, null)
}

IdbChunkStore.prototype.destroy = function (cb) {
  var self = this

  var store = self._store
  self._store = null

  store.clear(function (err) {
    store.close()
    if (cb) cb(err)
  })
}

function noop () {
  // do nothing
}
