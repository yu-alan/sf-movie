/**
 * Created by alanyu on 3/19/17.
 */

const _ = require('underscore')
const fivebeans = require('fivebeans')
const MongoClient = require('mongodb').MongoClient
const constants = require('../../constants')
const HttpWorker = require('./httpWorker')
const config = require('../config')

class Handler extends HttpWorker {
  groupMovies (movies) {
    return _.groupBy(movies, (movie) => {
      return movie.title
    })
  }

  getStoredMovies (queriedMovies, callback) {
    MongoClient.connect(constants.url, (err, db) => {
      if (err) throw err

      db.collection('movies').find({
        title: { $in : _.keys(queriedMovies) }
      }).toArray((err, storedMovies) => {
        callback(storedMovies)
        db.close()
      })
    })
  }

  removedStoredMovies (queriedMovies, storedMovies) {
    const shouldQueryMovies = []

    Object.keys(queriedMovies).map(function (key) {
      const movie = queriedMovies[key]
      if (!storedMovies[key]) {
        shouldQueryMovies.push(movie)
      }
    })

    return shouldQueryMovies
  }

  processMovies (queriedMovies) {
    // sort it by title so it will be easier to be handled when implementing search
    queriedMovies = this.groupMovies(queriedMovies)

    // we want to remove
    this.getStoredMovies(queriedMovies, (storedMovies) => {
      storedMovies = this.groupMovies(storedMovies)
      const shouldQueryMovies = this.removedStoredMovies(queriedMovies, storedMovies)

      const client = new fivebeans.client(process.env.BEANSTALKD_HOST, process.env.BEANSTALKD_PORT)

      // we will pass the each movie to a worker to get geo coords
      client.on('connect', () => {
        client.use(config.http.geoCoordTube, (err) => {
          if (err) throw err
          shouldQueryMovies.forEach((movie) => {
            client.put(0, 0, 60, JSON.stringify({ throw: true, result: 'success', movie: movie }), () => {})
          })
        })
      }).connect()
    })
  }

  run (url) {
    const getMovies = this.get(url)
    getMovies.then((result) => {
      this.processMovies(JSON.parse(result))
    })
  }
}

module.exports = Handler
