/**
 * Created by alanyu on 3/26/17.
 */
import axios from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'
import {
  FETCH_SEARCHED_MOVIES,
  UPDATE_SEARCHED_MOVIES,
  UPDATE_LAST_SEARCH_PHRASE
} from 'store/search'

import {
  FETCH_MOVIE_LOCATIONS_BY_ID,
  UPDATE_MOVIE_LOCATIONS
} from 'store/map'

const fetchSearchedMovies = (phrase) => {
  return new Promise((resolve, reject) => {
    return axios.post('/api/movies/search', { phrase: phrase })
      .then((response) => {
        resolve(response.data)
      })
  })
}

const fetchMovieLocationsById = (id) => {
  return new Promise((resolve, reject) => {
    return axios.post('/api/movies/locations', { id: id })
      .then((response) => {
        resolve(response.data)
      })
  })
}

function* getSearchedMovies (action) {
  yield put({ type: UPDATE_LAST_SEARCH_PHRASE, phrase: action.phrase })
  let results = []
  if (action.phrase !== '') {
    results = yield call(fetchSearchedMovies, action.phrase)
  }
  yield put({ type: UPDATE_SEARCHED_MOVIES, results })
}

function* getMovieLocationsById (action) {
  yield put({ type: UPDATE_LAST_SEARCH_PHRASE, phrase: action.title })
  const results = yield call(fetchMovieLocationsById, action.id)
  const locations = results.data.locations
  const bounds = results.bounds
  yield put({ type: UPDATE_MOVIE_LOCATIONS, locations, bounds })
}

export default function* search () {
  yield [
    takeEvery(FETCH_SEARCHED_MOVIES, getSearchedMovies),
    takeEvery(FETCH_MOVIE_LOCATIONS_BY_ID, getMovieLocationsById)
  ]
}
