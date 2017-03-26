/**
 * Created by alanyu on 3/26/17.
 */
import { connect } from 'react-redux'
import {
  fetchSearchedMovies
} from 'store/search'
import Search from '../components/Search'

const mapStateToProps = (state) => ({
  lastSearchPhrase: state.search.lastSearchPhrase,
  results: state.search.results
})

const mapDispatchToProps = (dispatch) => ({
  fetchSearchedMovies: (phrase) => {
    dispatch(fetchSearchedMovies(phrase))
  }
})

const SearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)

export default SearchContainer
