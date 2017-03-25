/**
 * Created by alanyu on 3/20/17.
 */

const assert = require('assert')
const sinon = require('sinon')
const AddToMovieCollectionHandler = require('./addToMovieCollection')

describe('DB Workers', function () {
  describe('insert data to collection', function () {
    it('should call the mongodb client', function (done) {
      const addToMovieCollection = new AddToMovieCollectionHandler()

      const insertToCollection = sinon.stub(addToMovieCollection, 'insertToCollection').callsFake(() => {})
      const movieExists = sinon.stub(addToMovieCollection, 'movieExists')

      movieExists.resolves(false)

      addToMovieCollection.run({
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

    it('should check if movie exists before inserting', function (done) {
      const addToMovieCollection = new AddToMovieCollectionHandler()
      const insertToCollection = sinon.spy(addToMovieCollection, 'insertToCollection')
      const movieExists = sinon.stub(addToMovieCollection, 'movieExists')

      movieExists.resolves(true)

      addToMovieCollection.run({
        throw: true,
        result: 'success',
        collection: 'movies',
        data: [{ test: 'first' }, { test: 'third' }]
      })

      setImmediate(() => {
        assert(insertToCollection.notCalled)
        done()
      })
    })
    it('should add only longitude, latitude and formattedAddress', function () {
      const addToMovieCollection = new AddToMovieCollectionHandler()

      const movie = {
        title: 'testMovie',
        locations: [
          { longitude: 37.7908379, latitude: -122.3893566, formattedAddress: 'test1', description: 'desc1' },
          { longitude: 38.7908379, latitude: -123.3893566, formattedAddress: 'test2', description: 'desc2' },
          { longitude: 39.7908379, latitude: -124.3893566, formattedAddress: 'test3', description: 'desc3' }
        ]
      }

      const expectedOutput = {
        title: 'testMovie',
        locations: [
          { longitude: 37.7908379, latitude: -122.3893566, formattedAddress: 'test1' },
          { longitude: 38.7908379, latitude: -123.3893566, formattedAddress: 'test2' },
          { longitude: 39.7908379, latitude: -124.3893566, formattedAddress: 'test3' }
        ]
      }

      const result = addToMovieCollection.formatMoviesData(movie)
      assert.deepEqual(result, expectedOutput)
    })
  })
})
