/**
 * Created by alanyu on 3/19/17.
 */

const _ = require('underscore')
const fivebeans = require('fivebeans')
const HttpWorker = require('./httpWorker')
const config = require('../config')

class Handler extends HttpWorker {
  groupMovies (movies) {
    return _.groupBy(movies, (movie) => {
      return movie.title
    })
  }

  processMovies (movies) {
    // sort it by title so it will be easier to be handled when implementing search
    movies = this.groupMovies(movies)

    const client = new fivebeans.client(process.env.BEANSTALKD_HOST, process.env.BEANSTALKD_PORT)

    // we will pass the each movie to a worker to get geo coords
    client.on('connect', () => {
      client.use(config.http.geoCoordTube, (err) => {
        if (err) throw err
        Object.keys(movies).map(function(key) {
          const movie = movies[key]
          client.put(0, 0, 60, JSON.stringify({ throw: true, result: 'success', movie: movie }), () => {})
        })
      })
    }).connect()
  }

  run (url) {
    const getMovies = this.get(url)
    getMovies.then((result) => {
      this.processMovies(JSON.parse(result))
    })
  }
}

module.exports = Handler
