/**
 * Created by alanyu on 3/25/17.
 */
const express = require('express')
const router = express.Router()
const movieController = require('../controllers/movieController')

router.post('/search', movieController.search)

module.exports = router
