/**
 * Created by alanyu on 3/19/17.
 */
const assert = require('assert')
const sinon = require('sinon')
const GetMoviesHandler = require('./getMovies')
const GetGeoCoordHandler = require('./getGeoCoord')

describe('HTTP Workers', function () {
  describe('Get Movies', function () {
    let getMoviesHandler
    let httpClient

    beforeEach(function () {
      getMoviesHandler = new GetMoviesHandler()
    })

    afterEach(function () {
      httpClient.restore()
    })

    it('should call the http client', function () {
      httpClient = sinon.spy(getMoviesHandler, 'get')

      getMoviesHandler.run('https://data.sfgov.org/resource/wwmu-gmzc.json')
      assert(httpClient.called)
    })

    it('should parse a JSON', function (done) {
      const testData = [
        { name: 'movie1', year: 1991 },
        { name: 'movie2', year: 1992 },
        { name: 'movie3', year: 1993 }
      ]
      const workerClient = sinon.stub(getMoviesHandler, 'processMovies').callsFake(() => {})
      httpClient = sinon.stub(getMoviesHandler, 'get').resolves(JSON.stringify(testData))

      setImmediate(() => {
        assert(workerClient.calledWith(testData))
        done()
      })

      getMoviesHandler.run('https://data.sfgov.org/resource/wwmu-gmzc.json')
    })

    it('should group the arrays by movie title', function () {
      const input = [
        { title: 'movie1', description: 'shot 1', location: 'place 1' },
        { title: 'movie2', description: 'shot 2', location: 'place 2' },
        { title: 'movie1', description: 'shot 3', location: 'place 3' }
      ]

      const expectedOutput = {
        'movie1': [
          { title: 'movie1', description: 'shot 1', location: 'place 1' },
          { title: 'movie1', description: 'shot 3', location: 'place 3' }
        ],
        'movie2': [
          { title: 'movie2', description: 'shot 2', location: 'place 2' }
        ]
      }

      const result = getMoviesHandler.groupMovies(input)
      assert.deepEqual(result, expectedOutput)
    })

    it('should only call geocode service if it\'s not inside the database', function () {
      const queriedMovies = {
        'movie1': [{ title: 'movie1', description: 'shot 1', location: 'place 1' }],
        'movie2': [{ title: 'movie2', description: 'shot 2', location: 'place 2' }, { title: 'movie2', description: 'shot 4', location: 'place 4' }],
        'movie3': [{ title: 'movie3', description: 'shot 3', location: 'place 3' }]
      }

      const storedMovies = {
        'movie1': [{ title: 'movie1', description: 'shot 1', location: 'place 1' }],
        'movie3': [{ title: 'movie3', description: 'shot 3', location: 'place 3' }]
      }

      const expectedOutput = [[{ title: 'movie2', description: 'shot 2', location: 'place 2' }, { title: 'movie2', description: 'shot 4', location: 'place 4' }]]

      const result = getMoviesHandler.removedStoredMovies(queriedMovies, storedMovies)
      assert.deepEqual(result, expectedOutput)
    })
  })

  describe('Get Geo Coords', function () {
    let getGeoCoordHandler
    let httpClient
    let saveToDb

    beforeEach(function () {
      getGeoCoordHandler = new GetGeoCoordHandler()
      saveToDb = sinon.stub(getGeoCoordHandler, 'saveToDb').callsFake(() => {})
    })

    afterEach(function () {
      httpClient.restore()
      saveToDb.restore()
    })

    it('should call google geocode endpoints using movie locations', function () {
      const input = [
        { title: 'movie1', description: 'shot 1', locations: 'place 1' },
        { title: 'movie1', description: 'shot 3', locations: 'place 3' }
      ]

      httpClient = sinon.spy(getGeoCoordHandler, 'getGeocode')

      getGeoCoordHandler.run({ movie: input })

      assert(httpClient.calledWith('place 1'))
      assert(httpClient.calledWith('place 3'))
    })

    it('should check if object has locations and non empty strings before calling google geocode', function () {
      const input = [
        { title: 'movie1', description: 'shot 1', locations: 'place 1' },
        { title: 'movie1', description: 'shot 3', locations: 'place 3' },
        { title: 'movie1', description: 'shot 4' },
        { title: 'movie1', description: 'shot 4', locations: '' }
      ]

      httpClient = sinon.spy(getGeoCoordHandler, 'getGeocode')

      getGeoCoordHandler.run({ movie: input })

      assert(httpClient.calledWith('place 1'))
      assert(httpClient.calledWith('place 3'))
      assert(httpClient.neverCalledWith(''))
      assert(httpClient.neverCalledWith(undefined))
    })

    it('should add location to movie scenes if found', function (done) {
      const input = [
        { title: 'movie1', description: 'shot 1', locations: 'place 1' },
        { title: 'movie1', description: 'shot 2', locations: 'place 2' },
        { title: 'movie1', description: 'shot 3', locations: 'place 3' }
      ]

      httpClient = sinon.stub(getGeoCoordHandler, 'getGeocode')
      httpClient.onCall(0).resolves([{ test: 'first' }])
      httpClient.onCall(1).resolves([])
      httpClient.onCall(2).resolves([{ test: 'third' }])

      getGeoCoordHandler.run({ movie: input })

      setImmediate(() => {
        assert(saveToDb.calledWithExactly(input, [{ test: 'first' }, { test: 'third' }]))
        done()
      })
    })
  })
})
