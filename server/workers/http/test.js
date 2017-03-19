/**
 * Created by alanyu on 3/19/17.
 */
const assert = require('assert')
const sinon = require('sinon')
const request = require('request')
const GetMoviesHandler = require('./getMovies')
const GetGeoCoordHandler = require('./getGeoCoord')

describe('HTTP Consumers', function () {
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

    it('should parse a JSON and pass it to be processed', function (done) {
      const testData = [
        { name: 'movie1', year: 1991 },
        { name: 'movie2', year: 1992 },
        { name: 'movie3', year: 1993 }
      ]
      const workerClient = sinon.spy(getMoviesHandler, 'processMovies')
      httpClient = sinon.stub(getMoviesHandler, 'get').resolves(JSON.stringify(testData))

      setTimeout(() => {
        assert(workerClient.calledWith(testData))
        done()
      }, 0)

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
  })

  describe('Get Geo Coords', function () {
    let getGeoCoordHandler
    let httpClient

    beforeEach(function () {
      getGeoCoordHandler = new GetGeoCoordHandler()
    })

    afterEach(function () {
      httpClient.restore()
    })

    it('should call api endpoints using movie locations', function () {
      const input = [
        { title: 'movie1', description: 'shot 1', locations: 'place 1' },
        { title: 'movie1', description: 'shot 3', locations: 'place 3' }
      ]

      httpClient = sinon.spy(getGeoCoordHandler, 'getGeocode')

      getGeoCoordHandler.run({ movie: input })

      assert(httpClient.calledWith('place 1'))
      assert(httpClient.calledWith('place 3'))
    })

    it('should check if object has locations and non empty strings before calling google geo-coords', function () {
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

    it('should add location to scences if found', function (done) {
      const input = [
        { title: 'movie1', description: 'shot 1', locations: 'place 1' },
        { title: 'movie1', description: 'shot 2', locations: 'place 2' },
        { title: 'movie1', description: 'shot 3', locations: 'place 3' }
      ]

      httpClient = sinon.stub(getGeoCoordHandler, 'getGeocode')
      httpClient.onCall(0).resolves([{ test: 'first' }])
      httpClient.onCall(1).resolves([])
      httpClient.onCall(2).resolves([{ test: 'third' }])
      const saveToDb = sinon.spy(getGeoCoordHandler, 'saveToDb')

      getGeoCoordHandler.run({ movie: input })

      setTimeout(() => {
        assert(saveToDb.calledWithExactly(input, [{ test: 'first' }, { test: 'third' }]))
        done()
      }, 0)
    })

    it('should only pass movie to be processed if it has 1 or more found geo coords scences', function (done) {
      const input = [
        { title: 'movie1', description: 'shot 1', locations: 'place 1' }
      ]

      httpClient = sinon.stub(getGeoCoordHandler, 'getGeocode')
      httpClient.onCall(0).resolves([])
      const saveToDb = sinon.spy(getGeoCoordHandler, 'saveToDb')

      getGeoCoordHandler.run({ movie: input })

      setTimeout(() => {
        assert(saveToDb.notCalled)
        done()
      }, 0)
    })
  })
})
