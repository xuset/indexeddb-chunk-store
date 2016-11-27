# indexdb-chunk-store [![Build Status](https://travis-ci.org/xuset/indexdb-chunk-store.svg?branch=master)](https://travis-ci.org/xuset/indexdb-chunk-store) [![npm](https://img.shields.io/npm/v/indexdb-chunk-store.svg)](https://npmjs.org/package/indexdb-chunk-store)

#### An [abstract-chunk-store](https://www.npmjs.com/package/abstract-chunk-store) compliant store backed by IndexDB for the browser

[![abstract chunk store](https://cdn.rawgit.com/mafintosh/abstract-chunk-store/master/badge.svg)](https://github.com/mafintosh/abstract-chunk-store)[![Sauce Test Status](https://saucelabs.com/browser-matrix/xuset-idb-chunk.svg)](https://saucelabs.com/u/xuset-idb-chunk)

## Install

`npm install indexdb-chunk-store`

This module can be used with browserify or the [idbchunkstore.min.js](idbchunkstore.min.js) script can be included which will attach `IdbChunkStore` to `window`

## Usage

```js
var store = IdbChunkStore(10)

chunks.put(0, new Buffer('01234567890'), function (err) {
  if (err) throw err
  chunks.get(0, function (err, chunk) {
    if (err) throw err
    console.log(chunk) // '01234567890' as a buffer
  })
})
```

## API

The api is compatible with [abstract-chunk-store](https://github.com/mafintosh/abstract-chunk-store#api) so look there for the api docs. There is one difference from abstract-chunk-store and that is that the IdbChunkStore constrcutor.

### `new IdbChunkStore(chunkLength, [opts])`

Creates a new store with the given `chunkLength`. `opts` can have the following properties:
* `opts.name` - The name of the IndexDB database to open. If left undefined, a random database name is generated. If you reuse the same name across multiple IdbChunkStore instances or even web sessions, the data in the store will persist across these instances and sessions.
* `opts.length` - Limits the size of the chunk store. If left undefined, the store is not constrained by a max size.
