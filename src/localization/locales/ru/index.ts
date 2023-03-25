import common from './common'
// locations
import shop from './locations/shop'
import character from './locations/character'
import work from './locations/work'


export default {
  ...common,
  locations: {
    shop      : shop,
    character : character,
    work      : work,
  },
}
