/**
 * Created by alanyu on 3/26/17.
 */
import { connect } from 'react-redux'
import {
  fetchMovieLocationsByCoords,
  updateMapFrame
} from 'store/map'
import Map from '../components/Map'

const mapStateToProps = (state) => ({
  locations: state.map.locations,
  bounds: state.map.bounds,
  lastSearchPhrase: state.search.lastSearchPhrase,
  frame: state.map.frame
})

const mapDispatchToProps = (dispatch) => ({
  fetchMovieLocationsByCoords: () => {
    dispatch(fetchMovieLocationsByCoords())
  },
  updateMapFrame: (frame) => {
    dispatch(updateMapFrame(frame))
  }
})

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)

export default MapContainer
