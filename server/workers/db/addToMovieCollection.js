/**
 * Created by alanyu on 3/20/17.
 */

const MongoClient = require('mongodb').MongoClient
const constants = require('../../constants')

class Handler {

  insertToCollection (collection, movie) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(constants.url, (err, db) => {
        if (err) {
          reject(['release', 10])
        }

        db.collection(collection).insertOne(movie, (err, result) => {
          if (err) reject(err)
          db.close()
          resolve()
        })
      })
    })
  }

  formatMoviesData (movie) {
    const locations = []

    movie.locations.forEach((location) => {
      locations.push({
        latitude: location.latitude,
        longitude: location.longitude,
        formattedAddress: location.formattedAddress
      })
    })

    movie.locations = locations
    return movie
  }

  movieExists (collection, movie) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(constants.url, (err, db) => {
        if (err) {
          reject(err)
        }

        db.collection(collection).findOne({ title: movie.title }, { fields: { title: 1 } }, (doc) => {
          const found = doc.title !== null
          resolve(found)
          db.close()
        })
      })
    })
  }

  run (payload) {
    const { collection, data } = payload
    return this.movieExists(collection, data).then((found) => {
      if (found) {
        return 'success'
      } else {
        return this.insertToCollection(collection, data)
      }
    })
  }
}

module.exports = Handler

