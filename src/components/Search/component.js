/**
 * Created by alanyu on 3/26/17.
 */
import React, { PureComponent, PropTypes } from 'react'
import './style.scss'

class Search extends PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  handleSearch () {
    const { lastSearchPhrase, fetchSearchedMovies } = this.props

    if (lastSearchPhrase !== this.input.value) {
      fetchSearchedMovies(this.input.value)
    }
  }

  handleChange (event) {
    if (this.searchTimeout !== null) {
      clearTimeout(this.searchTimeout)
    }

    this.searchTimeout = setTimeout(this.handleSearch, 1000)
  }

  render () {
    const { results } = this.props
    const resultNodes = results.map((result, index) => (
      <li key={index}>{result.title}</li>
    ))

    return (
      <div className="search">
        <input ref={(input) => { this.input = input }} className='search-input' onChange={this.handleChange} />
        <ul className="search-results">
          { resultNodes }
        </ul>
      </div>
    )
  }
}

Search.propTypes = {
  fetchSearchedMovies: PropTypes.func.isRequired,
  lastSearchPhrase: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired
}

export default Search
