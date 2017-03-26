import React from 'react'
import GoogleMapReact from 'google-map-react'
import './HomeView.scss'
import Search from 'containers/SearchContainer'

export const HomeView = () => (
  <div>
    <Search />
    <div className='map'>
      <GoogleMapReact
        defaultCenter={{ lat: 59.95, lng: 30.33 }}
        defaultZoom={11}
      />
    </div>
  </div>
)

export default HomeView
