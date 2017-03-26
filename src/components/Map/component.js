/**
 * Created by alanyu on 3/26/17.
 */
import React, { Component, PropTypes } from 'react'
import './style.scss'
import GoogleMapReact from 'google-map-react'
import Marker from './marker'

class Map extends Component {
  render () {
    const { locations } = this.props

    const locationMarkers = locations.map((location, index) => {
      return (
        <Marker key={index} lat={location.latitude} lng={location.longitude} location={location} />
      )
    })

    return (
      <div className='map'>
        <GoogleMapReact
          defaultCenter={{ lat: 37.773972, lng: -122.431297 }}
          defaultZoom={11}
        >
          { locationMarkers }
        </GoogleMapReact>
      </div>
    )
  }

}

Map.propTypes = {
  locations: PropTypes.array.isRequired
}

export default Map
