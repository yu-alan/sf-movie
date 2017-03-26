/**
 * Created by alanyu on 3/26/17.
 */
import movie from './movie'

export default function* root () {
  yield [
    movie()
  ]
}
