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

const fetchSearchedMovies = (phrase) => {
  return new Promise((resolve, reject) => {
    return axios.post('/api/movies/search', { phrase: phrase })
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

export default function* search () {
  yield [
    takeEvery(FETCH_SEARCHED_MOVIES, getSearchedMovies)
  ]
}
