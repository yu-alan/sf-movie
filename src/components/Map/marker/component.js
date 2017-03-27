/**
 * Created by alanyu on 3/26/17.
 */
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import './style.scss'

const Marker = (props) => {
  const { location, $hover } = props
  const markerStyles = classNames('marker', {
    'hover': $hover
  })

  return (
    <div className={markerStyles}>
      <div>
        <p className="movie-title">{location.title}</p>
        <p>{location.formattedAddress}</p>
      </div>
    </div>
  )
}

Marker.propTypes = {
  location: PropTypes.object.isRequired,
  $hover: PropTypes.bool
}

export default Marker
