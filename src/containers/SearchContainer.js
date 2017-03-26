/**
 * Created by alanyu on 3/26/17.
 */
import { connect } from 'react-redux'
import {
  fetchSearchedMovies,
  updateSearchMovieResults
} from 'store/search'
import {
  fetchMovieLocationsById
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
  fetchMovieLocationsById: (id) => {
    dispatch(fetchMovieLocationsById(id))
  },
  fetchSearchedMovies: (phrase) => {
    dispatch(fetchSearchedMovies(phrase))
  }
})

const SearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)

export default SearchContainer
