/**
 * Created by alanyu on 3/26/17.
 */
import React, { PureComponent, PropTypes } from 'react'
import './style.scss'

class Marker extends PureComponent {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="marker" />
    )
  }

}

Marker.propTypes = {
  location: PropTypes.object.isRequired
}

export default Marker
