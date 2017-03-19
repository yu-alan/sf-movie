/**
 * Created by alanyu on 3/19/17.
 */

const NodeGeocoder = require('node-geocoder')

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
      geocoder.geocode(`country:United States&city:San Francisco&${address}`, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  saveToDb (movie, scenes) {
    // console.log(scenes)
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
        if (value.length > 0) {
          results.push(value[0])
        }
        return results
      }, [])

      if (values.length > 0) {
        this.saveToDb(movie, values)
      }

      return 'success'
    }).catch(reason => {
      return ['release', 120]
    })
  }
}

module.exports = Handler
