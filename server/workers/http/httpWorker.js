/**
 * Created by alanyu on 3/19/17.
 */
const request = require('request')

class HttpWorker {
  get (url) {
    return new Promise((resolve, reject) => {
      request
        .get(url, (error, response, body) => {
          if (error) throw reject(error)
          resolve(body)
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }
}

module.exports = HttpWorker
