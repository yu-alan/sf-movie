/**
 * Created by alanyu on 3/26/17.
 */
import React, { Component, PropTypes } from 'react'
import './style.scss'
import GoogleMapReact from 'google-map-react'
import { fitBounds } from 'google-map-react/utils'
import Marker from './marker'

class Map extends Component {
  constructor (props) {
    super(props)
    this.state = {
      size: this.getWidthHeight()
    }
    this.handleResize = this.handleResize.bind(this)
    this.getWidthHeight = this.getWidthHeight.bind(this)
  }

  getWidthHeight () {
    return {
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
  }

  handleResize () {
    this.setState(this.getWidthHeight())
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  render () {
    const { bounds, locations } = this.props

    const locationMarkers = locations.map((location, index) => {
      return (
        <Marker key={index} lat={location.latitude} lng={location.longitude} location={location} />
      )
    })

    const { center, zoom } = fitBounds({
      nw: {
        lat: bounds.maxLat,
        lng: bounds.minLng
      },
      se: {
        lat: bounds.minLat,
        lng: bounds.maxLng
      }
    }, this.state.size)

    return (
      <div className='map'>
        <GoogleMapReact
          center={center}
          zoom={zoom}
        >
          { locationMarkers }
        </GoogleMapReact>
      </div>
    )
  }

}

Map.propTypes = {
  bounds: PropTypes.object.isRequired,
  locations: PropTypes.array.isRequired
}

export default Map
