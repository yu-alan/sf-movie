/**
 * Created by alanyu on 3/26/17.
 */
import { connect } from 'react-redux'

import Map from '../components/Map'

const mapStateToProps = (state) => ({
  locations: state.map.locations
})

const mapDispatchToProps = (dispatch) => ({

})

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)

export default MapContainer
