/**
 * Created by alanyu on 3/26/17.
 */
import React, { PureComponent, PropTypes } from 'react'
import SearchItem from './SearchItem'
import './style.scss'

class Search extends PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
  }

  handleSearch () {
    const { lastSearchPhrase, fetchSearchedMovies } = this.props

    if (lastSearchPhrase !== this.input.value) {
      fetchSearchedMovies(this.input.value)
    }
  }

  handleClick (result) {
    const { clearResults, fetchMovieLocationsById } = this.props

    clearResults()
    this.input.value = result.title

    fetchMovieLocationsById(result._id, result.title)
  }

  handleChange (event) {
    if (this.searchTimeout !== null) {
      clearTimeout(this.searchTimeout)
    }

    this.searchTimeout = setTimeout(this.handleSearch, 1000)
  }

  clearSearch () {
    this.input.value = ''
    this.input.focus()
    this.handleSearch()
  }

  render () {
    const { results } = this.props
    const resultNodes = results.map((result, index) => (
      <SearchItem key={index} result={result} onClick={this.handleClick} />
    ))

    return (
      <div className="search">
        <input placeholder="Search for a movie..." ref={(input) => { this.input = input }} className='search-input' onChange={this.handleChange} />
        <button className="clear" onClick={this.clearSearch}>Clear</button>
        <ul className="search-results">
          { resultNodes }
        </ul>
      </div>
    )
  }
}

Search.propTypes = {
  clearResults: PropTypes.func.isRequired,
  fetchMovieLocationsById: PropTypes.func.isRequired,
  fetchSearchedMovies: PropTypes.func.isRequired,
  lastSearchPhrase: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired
}

export default Search
