/**
 * Created by alanyu on 3/20/17.
 */

const MongoClient = require('mongodb').MongoClient
const constants = require('../../constants')

class Handler {

  insertToCollection (collection, data) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(constants.url, (err, db) => {
        if (err) {
          reject(['release', 10])
        }

        db.collection(collection).insertOne(data, (err, result) => {
          if (err) reject(err)
          db.close()
          resolve()
        })
      })
    })
  }

  run (payload) {
    const { collection, data } = payload
    return this.insertToCollection(collection, data)
  }
}

module.exports = Handler

