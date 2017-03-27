/**
 * Created by alanyu on 3/26/17.
 */
export const FETCH_MOVIE_LOCATIONS_BY_ID = 'FETCH_MOVIE_LOCATIONS_BY_ID'
export const UPDATE_MOVIE_LOCATIONS = 'UPDATE_MOVIE_LOCATIONS'
export const UPDATE_MAP_BOUNDS = 'UPDATE_MAP_BOUNDS'

export const fetchMovieLocationsById = (id, title) => ({
  type: FETCH_MOVIE_LOCATIONS_BY_ID,
  id,
  title
})

const initialState = {
  locations: [],
  bounds: { maxLat: 37.8049295, minLat: 37.7576171, maxLng: -122.3594155, minLng: -122.4576844 }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MOVIE_LOCATIONS:
      return { ...state, locations: action.locations }
    case UPDATE_MAP_BOUNDS:
      return { ...state, bounds: action.bounds }
    default:
      return state
  }
}

export default reducer
