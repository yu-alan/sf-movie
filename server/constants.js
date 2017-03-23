/**
 * Created by alanyu on 3/21/17.
 */
require('dotenv').config()

exports.url = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`
