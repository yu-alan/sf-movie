/**
 * Created by alanyu on 3/26/17.
 */
export const FETCH_MOVIE_LOCATIONS_BY_ID = 'FETCH_MOVIE_LOCATIONS_BY_ID'
export const UPDATE_MOVIE_LOCATIONS = 'UPDATE_MOVIE_LOCATIONS'

export const fetchMovieLocationsById = (id) => ({
  type: FETCH_MOVIE_LOCATIONS_BY_ID,
  id
})

const initialState = {
  locations: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MOVIE_LOCATIONS:
      return { ...state, locations: action.locations }
    default:
      return state
  }
}

export default reducer
