/**
 * Created by alanyu on 3/26/17.
 */
import { connect } from 'react-redux'
import {
  fetchSearchedMovies,
  updateSearchMovieResults
} from 'store/search'
import {
  fetchMovieLocationsById,
  fetchMovieLocationsByCoords
} from 'store/map'

import Search from '../components/Search'

const mapStateToProps = (state) => ({
  lastSearchPhrase: state.search.lastSearchPhrase,
  results: state.search.results
})

const mapDispatchToProps = (dispatch) => ({
  clearResults: () => {
    dispatch(updateSearchMovieResults([]))
  },
  fetchMovieLocationsById: (id, title) => {
    dispatch(fetchMovieLocationsById(id, title))
  },
  fetchSearchedMovies: (phrase) => {
    dispatch(fetchSearchedMovies(phrase))
  },
  fetchMovieLocationsByCoords: () => {
    dispatch(fetchMovieLocationsByCoords())
  }
})

const SearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)

export default SearchContainer
