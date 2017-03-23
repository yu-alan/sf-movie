/**
 * Created by alanyu on 3/20/17.
 */

const assert = require('assert')
const sinon = require('sinon')
const AddToCollectionHandler = require('./addToCollection')

describe('DB Workers', function () {
  describe('insert data to collection', function () {
    it('should call the mongodb client', function (done) {
      const addToCollection = new AddToCollectionHandler()

      const insertToCollection = sinon.stub(addToCollection, 'insertToCollection').callsFake(() => {})

      addToCollection.run({
        throw: true,
        result: 'success',
        collection: 'movies',
        data: [{ test: 'first' }, { test: 'third' }]
      })

      setImmediate(() => {
        assert(insertToCollection.calledWith('movies', [{ test: 'first' }, { test: 'third' }]))
        done()
      })
    })
  })
})
