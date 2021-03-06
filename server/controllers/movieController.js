/**
 * Created by alanyu on 3/25/17.
 */
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const geolib = require('geolib')
const constants = require('../constants')

exports.search = (req, res) => {
  const searchPhrase = req.body.phrase

  MongoClient.connect(constants.url, (err, db) => {
    if (err) res.status(500).send('Internal error')

    db.collection('movies').find(
        { searchPattern: new RegExp(searchPhrase.toUpperCase()), locations: { $gt: [] } },
        { _id: 1, title: 1 },
        { limit: 10 }
      ).toArray((err, result) => {
        if (err) res.status(500).send('Internal error')
        db.close()
        res.send(result)
      })
  })
}

exports.locations = (req, res) => {
  if (req.body.id) {
    MongoClient.connect(constants.url, (err, db) => {
      if (err) res.status(500).send('Internal error')
      db.collection('movies').findOne({ _id : new ObjectID(req.body.id) }, { title: 1, locations: 1 }, (err, result) => {
        if (err) res.status(500).send('Internal error')
        db.close()
        let bounds = geolib.getBounds(result.locations)

        if (result.locations.length === 1) {
          // since we only have one location we need to help create a frame around that location

          const location = result.locations[0]
          const frameBound = [
            { latitude: location.latitude - 0.01, longitude: location.longitude - 0.01 },
            { latitude: location.latitude - 0.01, longitude: location.longitude + 0.01 },
            { latitude: location.latitude + 0.01, longitude: location.longitude - 0.01 },
            { latitude: location.latitude + 0.01, longitude: location.longitude + 0.01 }
          ]
          bounds = geolib.getBounds([location, ...frameBound])
        }

        result.locations = result.locations.map((location) => {
          location.title = result.title
          return location
        })

        res.send({ data: result, bounds: bounds })
      })
    })
  } else if (req.body.coords) {
    const bounds = req.body.coords
    MongoClient.connect(constants.url, (err, db) => {
      if (err) res.status(500).send('Internal error')

      db.collection('movies').find({ locations: { $gt: [] } }, { locations: 1, title: 1 }, { limit: 15 }).toArray((err, result) => {
        if (err) res.status(500).send('Internal error')
        db.close()

        const locations = []

        result.forEach((movie) => {
          movie.locations.forEach((location) => {
            if (geolib.isPointInside(location, bounds)) {
              locations.push({
                title: movie.title,
                latitude: location.latitude,
                longitude: location.longitude,
                formattedAddress: location.formattedAddress
              })
            }
          })
        })

        res.send(locations)
      })
    })
  }
}
