var IdbChunkStore = require('.')
var abstractTests = require('abstract-chunk-store/tests')
var test = require('tape')

abstractTests(test, IdbChunkStore)

test('get non-existent chunk', function (t) {
  var store = new IdbChunkStore(10)
  store.get(0, function (err) {
    t.ok(err instanceof Error)
    t.end()
  })
})

test('programmer errors', function (t) {
  t.throws(function () { IdbChunkStore() })
  t.throws(function () { IdbChunkStore('foo') })

  var store = IdbChunkStore(10, {length: 15})

  t.throws(function () { store.put('foo', new Buffer('0123456789')) })
  t.throws(function () { store.put(0, 'bar') })

  t.throws(function () { store.get(0) })
  t.throws(function () { store.get('foo', function () {}) })
  t.end()
})

test('close()', function (t) {
  var store = IdbChunkStore(10)
  store.close(function (err) {
    t.equal(err, null)
    t.throws(function () { store.put(0, new Buffer('0123456789'), function () {}) })
    t.throws(function () { store.get(0, function () {}) })
    t.throws(function () { store.close() })
    t.throws(function () { store.destroy() })
    t.end()
  })
})
