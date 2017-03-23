/**
 * Created by alanyu on 3/19/17.
 */

const fivebeans = require('fivebeans')
const NodeGeocoder = require('node-geocoder')
const config = require('../config')

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_GEOCODING_API_KEY,
  formatter: null
}

class Handler {
  getGeocode (address) {
    const geocoder = NodeGeocoder(options)
    return new Promise((resolve, reject) => {
      geocoder.geocode(`country:United States&city:San Francisco&${address.trim()}`, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  saveToDb (movie, locations) {
    const client = new fivebeans.client(process.env.BEANSTALKD_HOST, process.env.BEANSTALKD_PORT)

    const data = {
      title: movie[0].title,
      locations: locations
    }

    client.on('connect', () => {
      client.use(config.db.addToCollectionTube, (err) => {
        if (err) throw err
        client.put(0, 0, 60, JSON.stringify({
          throw: true,
          result: 'success',
          collection: 'movies',
          data: data
        }), () => {})
      })
    }).connect()
  }

  run (payload, job_info) {
    const { movie } = payload
    const scenes = movie.map((scene) => {
      if (scene.hasOwnProperty('locations') && scene.locations !== '') {
        // node-geocoder has an advanced usage but concatenates the search by using |.
        return this.getGeocode(scene.locations)
      }
    })

    return Promise.all(scenes).then((values) => {
      values = values.reduce((results, value) => {
        if (value && value.length > 0) {
          results.push(value[0])
        }
        return results
      }, [])

      this.saveToDb(movie, values)

      return 'success'
    }).catch(reason => {
      return ['release', 3600]
    })
  }
}

module.exports = Handler
