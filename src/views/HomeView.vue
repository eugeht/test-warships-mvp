<script setup lang="ts">
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
// Components
import CustomSelect from '@/components/CustomSelect.vue'
// Types
import type { 
  Vehicle, Vehicles, 
  VehicleTypes,
  Nation, Nations
} from '@/types/types'



// Composables
const { locale, t } = useI18n()



// FILTERS TOGGLER -------------------------------------------------------------
const isFiltersVisible: Ref<boolean> = ref( true )

const toggleFiltersVisible = () => {
  isFiltersVisible.value = !isFiltersVisible.value
}
// /FILTERS TOGGLER



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

// @todo: save to localStorage
const nation: Ref<string | null> = ref( null )

// Set locale and save to localStorage
const setNation = ( value: string ) => {
  nation.value = value

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

      console.log( 'Nations', nations.value )
    }
  } catch ( errors ) {
    console.log( errors )
  }
}



// VEHICLE TYPES ---------------------------------------------------------------

// @todo: save to localStorage
const vehicleType: Ref<string | null> = ref( null )

const setVehicleType = ( value: string ) => {
  vehicleType.value = value

  // localStorage.setItem( 'nation', nation.value )
}


const unsetVehicleType = () => {
  vehicleType.value = null
}


const vehicleTypes: Ref<VehicleTypes | undefined> = ref()


const loadVehicleTypes = async () => {
  interface VehicleTypesResponse {
    data   : VehicleTypes
    status : string
  }

  try {
    const { data } = await api.get<VehicleTypesResponse>( 'vehicle_types_common' )
    if ( data.data ) {
      // vehicleTypes.value = data.data
      vehicleTypes.value = Object.keys( data.data )
        .reduce( ( acc: VehicleTypes, key ) => {
          acc[ key.toLowerCase() ] = data.data[ key ]
          return acc
        }, {} )
      console.log( 'VehicleTypes', vehicleTypes.value )
    }
  } catch ( errors ) {
    console.log( errors )
  }
}



// VEHICLES --------------------------------------------------------------------

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
} )
</script>



<template>
  <nav class="home-filters">
    <div 
      class="home-filters__layout"
      :class="{
        'home-filters__layout--hidden': !isFiltersVisible
      }"
    >
      <div 
        v-if="vehicleTypes"
        class="home-filters-filter"
      >
        <CustomSelect 
          :placeholder="t('selectVehicleType')"
          :value="vehicleType"
          :options="vehicleTypes"
          :show-icon="true"
          :media-path="mediaPath"
          @select="$vehicleType => setVehicleType( $vehicleType )"
          @clear="unsetVehicleType"
        />
      </div>

      <div 
        v-if="nations"
        class="home-filters-filter"
      >
        <CustomSelect 
          :placeholder="t('selectNation')"
          :value="nation"
          :options="nations"
          :show-icon="true"
          :media-path="mediaPath"
          @select="$nation => setNation( $nation )"
          @clear="unsetNation"
        />
      </div>

      <div class="home-filters-filter">
        <input 
          v-model="searchQuery"
          type="text"
          class="home-filters-filter__input"
          :placeholder="t('search')"
        >
        <button 
          v-if="searchQuery"
          class="home-filters-filter__btn"
          @click="unsetSearchQuery"
        >
          <svg
            class="home-filters-filter__icon"
            width="22"
            height="22"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use xlink:href="#svg-icon-close-cross" />
          </svg>
        </button>
      </div>
    </div>

    <!-- mobile shkink -->
    <button 
      class="home-filters-shrink-btn"
      @click="toggleFiltersVisible"
    >
      <svg
        class="home-filters-shrink-btn__icon"
        width="24"
        height="10"
        viewBox="0 120 512 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <use xlink:href="#svg-icon-chevron-compact" />
      </svg>
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
        :page-size="getVehicles.length || 1"
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
    </div>
  </div>
</template>



<style lang="scss">

// FILTERS ---------------------------------------------------------------------
$home-filters-breakpoint-md: #{ rem( 640px ) };
$home-filters-breakpoint-lg: #{ rem( 800px ) };



.home-filters {
  position: relative;
}


.home-filters__layout {
  display: flex;
  padding: #{ rem(10px) } #{ rem(10px) };

  flex-direction: column;
  background: var(--color-navbar);
  gap: #{rem(8px)};

  @media only screen and (min-width: #{ $home-filters-breakpoint-md }) {
    flex-direction: row;
    gap: #{rem(16px)};
  }

  &.home-filters__layout--hidden {
    overflow: hidden;
    height: #{rem(0px)};
    padding: 0;
    border-top: #{rem(8px)} solid var(--color-navbar);
  }
}


.home-filters-filter {
  position: relative;

  justify-content: space-between;

  flex-grow: 1;
  
  // @media only screen and (min-width: #{ $home-filters-breakpoint-md }) {
  // }

  @media only screen and (min-width: #{ $home-filters-breakpoint-lg }) {
    min-width: 200px;

    flex-grow: 0;
  }
}


.home-filters-filter__input {
  display: block;
  width: 100%;
  height: 1.8em;
  padding: var(--input-padding);
  margin: 0;
  border: none;
  background: var(--color-input-bg);
  border-radius: var(--input-border-radius);
  vertical-align: top;

  font-size: var(--input-font-size);
  color: var(--color-text);
  line-height: var(--input-line-height);
}


.home-filters-filter__btn {
  position: absolute;
  top: 0;
  right: 0;

  height: 100%;
  padding: 0 #{ rem(4px) };
  margin: 0;
  background: none;
  border: none;
  color: var(--color-text);
  opacity: 0.65;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
}

.home-filters-filter__icon {
  display: block;
  width: #{ rem(20px) };
  height: #{ rem(20px) };
}


.home-filters-shrink-btn {
  position: absolute;
  top: 100%;
  background: var(--color-navbar);
  color: var(--color-text);
  left: 50%;
  transform: translate(-50%, 0);
  appearance: none;
  padding: #{rem(2px)} #{rem(6px)};
  margin: 0;
  border: none;
  cursor: pointer;
  border-radius: 0 0 var(--input-border-radius) var(--input-border-radius);

  @media only screen and (min-width: #{ $home-filters-breakpoint-md }) {
    left: auto;
    transform: none;
    right: #{rem(6px)};
  }


  &::before {
    content: '';
    position: absolute;
    top: #{rem(-8px)};
    right: #{rem(-8px)};
    bottom: #{rem(-8px)};
    left: #{rem(-8px)};
  }
}


.home-filters-shrink-btn__icon {
  transform: rotate(180deg);
  opacity: 0.6;

  .home-filters-shrink-btn:hover & {
    opacity: 1;
  }

  .home-filters__layout--hidden ~ .home-filters-shrink-btn & {
    transform: rotate(0deg);
  }
}

// / FILTERS



.main {
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
