<script setup lang="ts">
// Vue
import { ref, type Ref, computed, type ComputedRef, onMounted } from 'vue'
// Api
import nationsApi from '@/api/nations.api'
import vehiclesApi from '@/api/vehicles.api'
// Virtual scroll
import Grid from 'vue-virtual-scroll-grid'
// Localization
import { useI18n } from 'vue-i18n'
// Components
import LogoLoader from '@/components/LogoLoader.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import VehicleBlock from '@/components/VehicleBlock.vue'
import VehicleSlider from '@/components/VehicleSlider.vue'
// Composables
import { useMedia } from '@/composables/useMedia'
import { useErrorAlert } from '@/composables/useErrorAlert'
// Types
import type { 
  Vehicle, Vehicles, 
  VehicleTypes,
  Nations
} from '@/types/types'



// Composables
const { locale, t } = useI18n()
const { mediaPath } = useMedia()
const { showAlert } = useErrorAlert()



// State
const isLoading: Ref<boolean> = ref( true )



// FILTERS TOGGLER -------------------------------------------------------------
const isFiltersVisible: Ref<boolean> = ref( true )

const toggleFiltersVisible = () => {
  isFiltersVisible.value = !isFiltersVisible.value
}
// /FILTERS TOGGLER



// SEARCH ----------------------------------------------------------------------
const filterSearchQuery: Ref<string | null> = ref( null )

const unsetFilterSearchQuery = () => {
  filterSearchQuery.value = null
}
// /SEARCH



// NATIONS ---------------------------------------------------------------------
// Current nation
const filterNation: Ref<string | null> = ref( localStorage.getItem( 'filterNation' ) || null )


// Set locale and save to localStorage
const setFilterNation = ( value: string ) => {
  filterNation.value = value

  // Save
  localStorage.setItem( 'filterNation', filterNation.value )
}


// Unset locale
const unsetFilterNation = () => {
  filterNation.value = null

  // Remove
  localStorage.removeItem( 'filterNation' )
}


// Nations list
const nations: Ref<Nations | undefined> = ref()


// Load nation list
const loadNations = async () => {
  const { data, error } = await nationsApi.getNations()

  if ( data ) {
    nations.value = data

    return
  } 

  if ( error ) {
    showAlert( error as Error )
  }
}



// VEHICLE TYPES ---------------------------------------------------------------
// Current vehicle type
const filterVehicleType: Ref<string | null> = ref( localStorage.getItem( 'filterVehicleType' ) )


// Set vehicle type and save
const setFilterVehicleType = ( value: string ) => {
  filterVehicleType.value = value

  // Save
  localStorage.setItem( 'filterVehicleType', filterVehicleType.value )
}


// Unset vehicle type and save
const unsetFilterVehicleType = () => {
  filterVehicleType.value = null

  // Remove
  localStorage.removeItem( 'filterVehicleType' )
}


// Vehicle types list
const vehicleTypes: Ref<VehicleTypes | undefined> = ref()


// Load vehicle types list
const loadVehicleTypes = async () => {
  const { data, error } = await vehiclesApi.getVehicleTypes()

  if ( data ) {
    vehicleTypes.value = data

    return
  }

  if ( error ) {
    showAlert( error as Error )
  }
}



// VEHICLES --------------------------------------------------------------------

// Vehicles Map
const vehicles: Ref<Vehicles | undefined> = ref( undefined )


// Filtered Map
const vehiclesFiltered: ComputedRef<Vehicles> = computed( () => {
  if ( !vehicles.value ) {
    return new Map() as Vehicles
  }

  if ( !filterNation.value && !filterVehicleType.value && !filterSearchQuery.value ) {
    return vehicles.value
  }

  let result: Vehicles = new Map()

  for ( let k of vehicles.value.keys() ) {
    const vehicle = vehicles.value.get( k ) as Vehicle

    // Nation filter
    if ( filterNation.value && vehicle.nation !== filterNation.value ) {
      continue
    }

    // Type filter
    if ( filterVehicleType.value ) {
      if ( vehicle.vehicleType !== filterVehicleType.value ) {
        continue
      }
    }

    if ( filterSearchQuery.value ) {
      if ( vehicle.localization.mark[ locale.value ]?.toLowerCase().indexOf( filterSearchQuery.value?.toLowerCase() ) < 0 ) {
        continue
      }
    }

    result.set( k, vehicle )
  }

  return result
} )


// Filtered Array of Keys [ for faster index access in Slider ]
const vehiclesFilteredKeys: ComputedRef<string[]> = computed( () => {
  return Array.from( vehiclesFiltered.value, entry => entry[ 0 ] ) || []
} )


// Filtered Array of Values [ for virt scroll lib ]
const vehiclesFilteredValues: ComputedRef<Vehicle[]> = computed( () => {
  return Array.from( vehiclesFiltered.value, entry => entry[ 1 ] ) || []
} )



const loadVehicles = async () => {
  const { data, error } = await vehiclesApi.getVehicles()

  if ( data ) {
    /* Тут нужно кое что просериализировать ( */
    const vehicleTypesValues = Object.keys( vehicleTypes.value || [] )

    for ( let i in data ) {
      data[ i ].id = i

      if ( vehicleTypesValues.length ) {
        data[ i ].tags.forEach( ( tag, tagIndex ) => {
          tag = tag.toLocaleLowerCase()
          data[ i ].tags[ tagIndex ] = tag
          
          if ( vehicleTypesValues.includes( tag )  ) {
            data[ i ].vehicleType = tag
          }
        } )
      }
    }

    vehicles.value = new Map( Object.entries( data ) )

    return
  }

  if ( error ) {
    showAlert( error as Error )
  }
}



// SLIDER ----------------------------------------------------------------------
const sliderVehicleId: Ref<number | undefined> = ref()
const isSliderVisible: Ref<boolean> = ref( false )



const openSlider = ( id: string ) => {
  isSliderVisible.value = true
  sliderVehicleId.value = Number( vehiclesFilteredKeys.value.indexOf( id ) )
}


const closeSlider = () => {
  isSliderVisible.value = false
  sliderVehicleId.value = undefined
}
// /SLIDER




onMounted( async () => {
  // Send requests
  await Promise.all( [
    // Loading nations
    loadNations(),
    // Loading vehicle types
    loadVehicleTypes(),
  ] )

  // Loading vehicles
  /* этот отдельно, тк надо проинитить тип и нацию, чтоб быстро фильтрация работала потом */
  await loadVehicles()

  // Unset loader
  isLoading.value = false
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
      <div class="home-filters-filter">
        <CustomSelect 
          :placeholder="t('selectVehicleType')"
          :value="filterVehicleType"
          :options="vehicleTypes"
          :show-icon="true"
          :media-path="mediaPath"
          @select="$vehicleType => setFilterVehicleType( $vehicleType )"
          @clear="unsetFilterVehicleType"
        />
      </div>

      <div class="home-filters-filter">
        <CustomSelect 
          :placeholder="t('selectNation')"
          :value="filterNation"
          :options="nations"
          :show-icon="true"
          :media-path="mediaPath"
          @select="$nation => setFilterNation( $nation )"
          @clear="unsetFilterNation"
        />
      </div>

      <div class="home-filters-filter">
        <input 
          v-model="filterSearchQuery"
          type="text"
          class="home-filters-filter__input"
          :placeholder="t('search')"
        >
        <button 
          v-if="filterSearchQuery"
          class="home-filters-filter__btn"
          @click="unsetFilterSearchQuery"
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

  <transition 
    name="component-fade" 
    mode="out-in"
  >
    <LogoLoader
      v-if="isLoading"
    />
    <div 
      v-else-if="vehicles && vehicleTypes && nations && mediaPath"
      class="vehicles-grid"
    >
      <transition 
        name="component-fade" 
        mode="out-in"
      >
        <Grid
          v-if="vehiclesFilteredValues.length >= 1"
          :length="vehiclesFilteredValues.length"
          :page-provider="async () => vehiclesFilteredValues"
          :page-size="vehiclesFilteredValues.length"
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
              @open="$vehicleId => openSlider( $vehicleId )"
            />
          </template>
        </Grid>
      </transition>
    </div>
  </transition>

  <Teleport to="body">
    <Transition name="component-fade-fast">
      <VehicleSlider 
        v-if="isSliderVisible && ( sliderVehicleId !== undefined ) && mediaPath && vehicleTypes && nations && vehiclesFiltered.size"
        :media-path="mediaPath"
        :nations="nations"
        :vehicle-id="sliderVehicleId"
        :vehicles="vehiclesFilteredValues"
        :vehicles-filtered-keys="vehiclesFilteredKeys"
        :vehicle-types="vehicleTypes"
        @close="closeSlider"
      />
    </Transition>
  </Teleport>
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

  &::after {
    content: '';

    display: block;
    height: #{rem(16px)};
  }
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

// /VEHICLES

</style>
