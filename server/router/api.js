/**
 * Created by alanyu on 3/25/17.
 */
const express = require('express')
const router = express.Router()
const movies = require('./movies')

router.use('/movies', movies)

module.exports = router
