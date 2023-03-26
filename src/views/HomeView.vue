<script setup lang="ts">
// Vue
import { ref, type Ref, computed, type ComputedRef, onMounted } from 'vue'
// Api
import { api } from '@/api'
// Virtual scroll
import Grid from 'vue-virtual-scroll-grid'
// Localization
import { useI18n } from 'vue-i18n'
// Components
import CustomSelect from '@/components/CustomSelect.vue'
import VehicleBlock from '@/components/VehicleBlock.vue'
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

  return result
} )


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
      aria-label="Shrink filters (сюда надо перевод)"
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

  <div 
    v-if="vehicles && vehicleTypes && nations && mediaPath"
    class="vehicles-grid"
  >
    <transition 
      name="component-fade" 
      mode="out-in"
    >
      <Grid
        v-if="getVehicles.length >= 1"
        :length="getVehicles.length"
        :page-provider="async () => getVehicles"
        :page-size="getVehicles.length"
        :respect-scroll-to-on-resize="true"
        class="vehicles"
      >
        <template #probe>
          <VehicleBlock />
        </template>

        <template #placeholder>
          <VehicleBlock />
        </template>

        <template #default="{ item, style }">
          <VehicleBlock 
            :vehicle="item"
            :style="style"
            :nations="nations"
            :vehicle-types="vehicleTypes"
            :media-path="mediaPath"
          />
        </template>
      </Grid>
    </transition>
  </div>
</template>



<style lang="scss">
// Breakpoints - filters
$home-filters-breakpoint-md: rem( 640px );
$home-filters-breakpoint-lg: rem( 800px );

// Breakpoints - grid
$grid-breakpoint-sm: rem( 600px );
$grid-breakpoint-md: rem( 1000px );
$grid-breakpoint-lg: rem( 1280px );
$grid-breakpoint-xl: rem( 1680px );



// FILTERS ---------------------------------------------------------------------
.home-filters {
  position: relative;

  z-index: 100;
}


.home-filters__layout {
  display: flex;
  padding: #{ rem(10px) } #{ rem(10px) };

  flex-direction: column;
  background: var(--color-navbar);
  gap: #{rem(8px)};

  @media only screen and (min-width: #{ $home-filters-breakpoint-md }) {
    padding: #{ rem(10px) } #{ rem(16px) };

    flex-direction: row;
    gap: #{rem(16px)};
  }

  &.home-filters__layout--hidden {
    overflow: hidden;
    height: 0;
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
  border-radius: var(--input-border-radius);

  color: var(--color-text);

  font-size: var(--input-font-size);
  line-height: var(--input-line-height);
  background: var(--color-input-bg);
  vertical-align: top;
}


.home-filters-filter__btn {
  position: absolute;
  top: 0;
  right: 0;

  height: 100%;
  padding: 0 #{ rem(4px) };
  margin: 0;

  border: none;

  color: var(--color-text);
  background: none;
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
  left: 50%;

  padding: #{rem(2px)} #{rem(6px)};
  margin: 0;

  transform: translate(-50%, 0);

  border: none;
  border-radius: 0 0 var(--input-border-radius) var(--input-border-radius);

  color: var(--color-text);
  background: var(--color-navbar);
  appearance: none;
  cursor: pointer;

  @media only screen and (min-width: #{ $home-filters-breakpoint-md }) {
    right: #{rem(6px)};
    left: auto;

    transform: none;
  }


  &::before {
    content: '';

    position: absolute;
    inset: #{rem(-8px)} #{rem(-8px)} #{rem(-8px)} #{rem(-8px)};
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



// VEHICLES --------------------------------------------------------------------
.vehicles-grid {
  padding: #{rem(16px)};

  // height: 800px;
  overflow: auto;

  flex: 0 1 auto;
}

.vehicles {
  display: grid;
  height: 100%;
  padding-top: #{ rem(16px) };
  grid-gap: 15px;
  grid-template-columns: repeat(1,1fr);
  
  @media only screen and (min-width: #{ $grid-breakpoint-sm }) {
    grid-template-columns: repeat(2,1fr);
  }

  @media only screen and (min-width: #{ $grid-breakpoint-md }) {
    grid-template-columns: repeat(3,1fr);
  }

  @media only screen and (min-width: #{ $grid-breakpoint-lg }) {
    grid-template-columns: repeat(4,1fr);
  }

  @media only screen and (min-width: #{ $grid-breakpoint-xl }) {
    grid-template-columns: repeat(5,1fr);
  }
} 

</style>
