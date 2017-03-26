/**
 * Created by alanyu on 3/26/17.
 */
import search from './search'

export default function* root () {
  yield [
    search()
  ]
}
