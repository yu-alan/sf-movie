const GetMoviesHandler = require('../server/workers/http/getMovies')

const getMoviesHandler = new GetMoviesHandler()
getMoviesHandler.run('https://data.sfgov.org/resource/wwmu-gmzc.json')
