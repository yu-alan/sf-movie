/**
 * Created by alanyu on 3/26/17.
 */
export const FETCH_SEARCHED_MOVIES = 'FETCH_SEARCHED_MOVIES'
export const UPDATE_SEARCHED_MOVIES = 'UPDATE_SEARCHED_MOVIES'
export const UPDATE_LAST_SEARCH_PHRASE = 'UPDATE_LAST_SEARCH_PHRASE'

const initialState = {
  lastSearchPhrase: '',
  results: []
}

export const updateSearchMovieResults = (results) => ({
  type: UPDATE_SEARCHED_MOVIES,
  results
})

export const updateLastSearchPhrase = (phrase) => ({
  type: UPDATE_SEARCHED_MOVIES,
  phrase
})

export const fetchSearchedMovies = (phrase) => ({
  type: FETCH_SEARCHED_MOVIES,
  phrase
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SEARCHED_MOVIES:
      return { ...state, results: action.results }
    case UPDATE_LAST_SEARCH_PHRASE:
      return { ...state, lastSearchPhrase: action.phrase }
    default:
      return state
  }
}

export default reducer
