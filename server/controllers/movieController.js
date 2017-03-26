/**
 * Created by alanyu on 3/25/17.
 */
const MongoClient = require('mongodb').MongoClient
const constants = require('../constants')

exports.search = (req, res) => {
  const searchPhrase = req.body.phrase

  MongoClient.connect(constants.url, (err, db) => {
    if (err) res.status(500).send('Internal error')

    db.collection('movies').find(
        { searchPattern: new RegExp(searchPhrase.toUpperCase()) },
        { _id: 1, title: 1 },
        { limit: 10 }
      ).toArray((err, result) => {
        if (err) res.status(500).send('Internal error')
        db.close()
        res.send(result)
      })
  })
}
