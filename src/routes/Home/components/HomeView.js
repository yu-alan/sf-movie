import React from 'react'
import './HomeView.scss'
import Search from 'containers/SearchContainer'
import Map from 'containers/MapContainer'

export const HomeView = () => (
  <div>
    <Search />
    <Map />
  </div>
)

export default HomeView
