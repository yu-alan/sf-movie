/**
 * Created by alanyu on 3/26/17.
 */
import React, { PureComponent, PropTypes } from 'react'

class SearchItem extends PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const { onClick, result } = this.props
    onClick(result)
  }

  render () {
    const { result } = this.props
    return (
      <li onClick={this.handleClick}>{result.title}</li>
    )
  }

}

SearchItem.propTypes = {
  result: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default SearchItem
