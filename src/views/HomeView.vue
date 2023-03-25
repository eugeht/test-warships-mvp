<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
// Vue
import { ref, type Ref, computed, type ComputedRef, onMounted } from 'vue'
// Api
import { api } from '@/api'
// Virtual scroll
import Grid from 'vue-virtual-scroll-grid'
// Localization
import { useI18n } from 'vue-i18n'
// Utils
import { integerToRoman } from '@/utils/typography'



// LOCALIZATION ----------------------------------------------------------------
const { locale } = useI18n()



// MEDIA -----------------------------------------------------------------------
let mediaPath: string | undefined


const loadMediaPath = async () => {
  interface MediaResponse {
    data   : string
    status : string
  }

  try {
    const { data } = await api.get<MediaResponse>( 'media_path' )
    if ( data.data ) {
      mediaPath = data.data
      // console.log( 'MediaPath', mediaPath )
    }
  } catch ( errors ) {
    console.log( errors )
  }
}



// SEARCH ----------------------------------------------------------------------
const searchQuery: Ref<string | null> = ref( null )

const unsetSearchQuery = () => {
  searchQuery.value = null
}




// NATIONS ---------------------------------------------------------------------
interface Nation {
  id: number
  name: string,
  icons: {
    default: string
    tiny: string
    small: string
    large: string
    // local_large: string // GUI
    // local_tiny: string // GUI
    // local_small: string // GUI
  },
  color: string // 14764062
  tags: string[]
  localization: {
    mark: {
      [ propName: string]: string
    }
  }
}

interface Nations {
  [ propName: string ]: Nation
}


// @todo: save to localStorage
const nation: Ref<string | null> = ref( null )

// Set locale and save to localStorage
const setNation = ( event: Event ) => {
  if ( !event.target ) {
    return
  }

  nation.value = ( event.target as HTMLSelectElement ).value

  // localStorage.setItem( 'nation', nation.value )
}

const unsetNation = () => {
  nation.value = null
}

const nations: Ref<Nations | undefined> = ref()


const loadNations = async () => {
  interface NationsResponse {
    data   : Nation[]
    status : string
  }

  try {
    const { data } = await api.get<NationsResponse>( 'nations' )
    if ( data.data ) {
      nations.value = data.data
        .filter( nation => {
          return !nation.tags.includes( 'hidden' )
        } )
        .reduce( ( acc: Nations, currentValue ) => {
          acc[ currentValue.name ] = currentValue
          return acc
        }, {} )

      // console.log( 'Nations', nations.value )
    }
  } catch ( errors ) {
    console.log( errors )
  }
}



// VEHICLE TYPES ---------------------------------------------------------------
interface VehicleType {
  name: string
  icons: {
    default: string
    elite: string
    premium: string
    special: string
    normal: string
  }
  sort_order: 5
  localization: {
    shortmark: {
      [ propName: string]: string
    }
    mark: {
      [ propName: string]: string
    }
  }
}



interface VehicleTypes {
  [ propName: string ] : VehicleType
}



// @todo: save to localStorage
const vehicleType: Ref<string | null> = ref( null )

const setVehicleType = ( event: Event ) => {
  if ( !event.target ) {
    return
  }

  vehicleType.value = ( event.target as HTMLSelectElement ).value
}

const unsetVehicleType = () => {
  vehicleType.value = null
}

const vehicleTypes: Ref<VehicleTypes | undefined> = ref()

const vehicleTypesOptions: ComputedRef<VehicleType[]> = computed( () => {
  if ( !vehicleTypes.value ) {
    return []
  }

  return Object.values( vehicleTypes.value ).sort( ( a, b ) => { 
    return a.sort_order > b.sort_order ? 1 : -1 
  } )
} )


const loadVehicleTypes = async () => {
  interface VehicleTypesResponse {
    data   : VehicleTypes
    status : string
  }

  try {
    const { data } = await api.get<VehicleTypesResponse>( 'vehicle_types_common' )
    if ( data.data ) {
      vehicleTypes.value = data.data
      // console.log( 'VehicleTypes', vehicleTypes.value )
    }
  } catch ( errors ) {
    console.log( errors )
  }
}



// VEHICLES --------------------------------------------------------------------
interface Vehicle {
  icons: {
    default: string // 214x126
    small: string // 214x126
    medium: string // 435x256
    large: string // 870x512
    contour: string
    contour_alive: string
    contour_dead: string
    // local_small: string // GUI
    // local_contour: string // GUI
    // local_contour_dead: string // GUI
    // local_contour_alive: string // GUI
  }
  level: number
  localization: {
    description: {
      [ propName: string ]: string
    }
    mark: {
      [ propName: string ]: string
    }
    shortmark: {
      [ propName: string ]: string
    }
  }
  name: string
  nation: string
  tags: string[]
}

interface Vehicles {
  [ propName: number ]: Vehicle
}

const vehicles: Ref<Vehicles | undefined> = ref( undefined )

const getVehicles: ComputedRef<Vehicle[]> = computed( () => {
  if ( !vehicles.value ) {
    return []
  }

  let result = Object.values( vehicles.value )

  // Nation filter
  if ( nation.value && nation.value !== 'all' ) {
    result = result.filter( vehicle => {
      return vehicle.nation === nation.value
    } )

    // console.log( 'Filtered for: ', nation.value )
  }

  // Type filter
  if ( vehicleType.value ) {
    result = result.filter( vehicle => {
      return vehicle.tags.findIndex( ( vehicle: string ) => { 
        return vehicleType.value && ( vehicle.toLowerCase() === vehicleType.value.toLowerCase() )
      } ) !== -1
    } )

    // console.log( 'Filtered for: ', vehicleType.value )
  }

  // Search query
  if ( searchQuery.value ) {
    result = result.filter( vehicle => {
      return vehicle.localization.mark[ locale.value ].toLowerCase().indexOf( searchQuery.value?.toLowerCase() ) > -1
    } )
  }

  // console.log( 'Filtered vehicles: ', result )

  return result
} )


const getVehicleTypes = ( tags: string[] ) => {
  return tags.filter( tag => {
    return vehicleTypes.value && vehicleTypes.value[ tag ]
  } )
}

const loadVehicles = async () => {
  interface VehicleResponse {
    data   : Vehicles
    status : string
  }

  try {
    const { data } = await api.get<VehicleResponse>( 'vehicles' )
    if ( data.data ) {
      vehicles.value = data.data
      // console.log( 'Vehicles', vehicles.value )
    }
  } catch ( errors ) {
    console.log( errors )
  }
}




onMounted( async () => {
  // Loading media path
  await loadMediaPath()

  // Loading nations
  await loadNations()

  // Loading vehicle types
  await loadVehicleTypes()

  // Loading vehicles
  await loadVehicles()

  // ..
} )
</script>



<template>
  <nav>
    <select
      v-model="vehicleType" 
      @change="( $event ) => setVehicleType( $event )"
    >
      <option 
        v-for="vehicleTypeOption in vehicleTypesOptions" 
        :key="`vehicleType_${ vehicleTypeOption.name }`" 
        :value="vehicleTypeOption.name" 
        :selected="vehicleTypeOption.name === vehicleType"
      >
        {{ vehicleTypeOption.name }}
      </option>
    </select>
    <button 
      v-if="vehicleType"
      @click="unsetVehicleType"
    >
      X
    </button>

    <select
      v-if="nations"
      v-model="nation" 
      @change="( $event ) => setNation( $event )"
    >
      <option 
        v-for="nationOption in nations" 
        :key="`nationOption_${ nationOption.name }`" 
        :value="nationOption.name" 
        :selected="nationOption.name === nation"
      >
        {{ nations[ nationOption.name ].localization.mark[ locale ] }}
      </option>
    </select>
    <button 
      v-if="nation"
      @click="unsetNation"
    >
      X
    </button>

    <input 
      v-model="searchQuery"
      type="text"
    >
    <button 
      v-if="searchQuery"
      @click="unsetSearchQuery"
    >
      X
    </button>
  </nav>

  <div class="main">
    <div 
      v-if="vehicles"
      class="container"
    >
      <!-- :page-provider="async (pageNumber, pageSize) => Array(pageSize).fill('x')" -->
      <Grid
        :length="getVehicles.length"
        :page-provider="async () => getVehicles"
        :page-size="getVehicles.length"
        :respect-scroll-to-on-resize="true"
        class="vehicles"
      >
        <template #probe>
          <div 
            class="vehicle"
            sizes="(min-width: 768px) 360px, 290px"
          >
            asdasd
          </div>
        </template>

        <template #placeholder="{ style }">
          <div 
            class="vehicle"
            :style="style" 
            sizes="(min-width: 768px) 360px, 290px"
          >
            ..
          </div>
        </template>

        <template #default="{ item, style }">
          <div 
            class="vehicle"
            :style="style"
          >
            <div class="vehicle-image">
              <span
                v-if="nations"
                class="chip chip--nation chip--nation--preview"
              >
                <img 
                  class="chip__icon"
                  :src="`${ mediaPath }${ nations[ item.nation ].icons.small }`"
                  width="214"
                  height="126"
                >
                <!-- {{ nations[ item.nation ].localization.mark[ locale ] }} -->
              </span>
              <img 
                :src="`${ mediaPath }${ item.icons.default }`"
                loading="lazy"
                width="214"
                height="126"
              >
            </div>
            <div class="vehicle-body">
              <header class="vehicle-header">
                <small>
                  <template v-if="item.level > 10">
                    ★
                  </template>
                  <template v-else>
                    {{ integerToRoman( item.level ) }}
                  </template>
                </small>

                {{ item.localization.mark[ locale ] }}
              </header>
              <div 
                v-if="vehicleTypes"
                class="vehicle__info"
              >
                <span
                  v-for="v in getVehicleTypes( item.tags )"
                  :key="`vehicleType_${ item.name }_${ v }`"
                  class="chip chip--vehicle-type"
                >
                  <img 
                    class="chip__icon"
                    :src="`${ mediaPath }${ vehicleTypes[ v ].icons.default }`"
                    width="27"
                    height="27"
                  >
                  {{ vehicleTypes[ v ].localization.mark[ locale ] }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </Grid>
      <!-- <div 
        v-if="vehicles"
        class="vehicles"
      >
        <div
          v-for="vehicle, code in vehicles"
          :key="`vehicle_${ code }`"
          class="vehicle"
        >
          <div>
            {{ vehicle.localization.mark[ locale ] }}
            <small>
              [level: {{ vehicle.level }}]
            </small>
            < !-- <div>
              {{ vehicle.localization.description[ locale ] }}
            </div> -- >
          </div>
          <div>
            <img 
              :src="`${ mediaPath }${ vehicle.icons.default }`"
              loading="lazy"
            >
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>



<style lang="scss">
// header {
//   border-bottom: 1px solid #fff;
// }

nav {
  padding: 0.5rem;
  background: #161616cf;
}

.main {
  // margin-top: 20px;
  // background: #102031;
  // height: 800px;
  overflow: auto;
}

.container {
  width: 760px;
  height: 800px;
  margin: 0 auto;
}

.vehicles {
  display: grid;
  height: 100%;
  padding-top: #{ rem(64px) };
  grid-gap: 15px;
  grid-template-columns: repeat(3,1fr);
} 

.vehicle {
  overflow: hidden;
} 

.vehicle-image {
  position: relative;

  img {
    margin: 0 auto;
  }
}

.vehicle-body {
  padding: 38px 16px 8px;
  margin-top: -25px;
  background: #00000029;
  border: 1px solid #9fb5fc29;
  border-radius: 4px;
}

.vehicle-header {
  font-family: $font-family-condensed;
  font-weight: 700;
  font-size: #{ rem(20px) };
  text-align: center;

  small {
    color: #AD7A07;
    font-size: 75%;
  }
}

.chip {
  display: inline-block;
  vertical-align: top;
  font-weight: 400;
  font-family: $font-family-condensed;
  font-size: #{ rem(14px) };
  line-height: 27px;

  color: rgb(159 181 252 / 75%);

  &.chip--vehicle-type {
    .chip__icon {
      width: 27px;
      height: 27px;
    }
  }

  &.chip--nation {
    // position: absolute;
  }
  
  &.chip--nation--preview {
    position: absolute;
    bottom: #{ rem( 40px ) };
    left: #{ rem( 4px ) };

    .chip__icon {
      width: 42px;

      // height: 27px;
    }
  }
}

.chip__icon {
  display: inline-block;
  vertical-align: top;
}

.vehicle__info {
  text-align: center;
}

// ..


</style>
