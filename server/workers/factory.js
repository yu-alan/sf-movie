/**
 * Created by alanyu on 3/19/17.
 */

// The purpose of this file is to subscribe the workers to their assigned tubes
const Worker = require('bsw')
const GetGeoCoord = require('./http/getGeoCoord')
const AddToCollection = require('./db/addToCollection')
const config = require('./config')

module.exports = {
  bootstrap () {
    new Worker({ tube: config.http.geoCoordTube, handler: GetGeoCoord }).start()
    new Worker({ tube: config.db.addToCollectionTube, handler: AddToCollection }).start()
  }
}
