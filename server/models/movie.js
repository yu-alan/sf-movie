/**
 * Created by alanyu on 3/25/17.
 */
const mongoose = require('mongoose')
const constants = require('../constants')

mongoose.connect(constants.url)

const Movie = mongoose.model('Movie', {})

module.exports = Movie
