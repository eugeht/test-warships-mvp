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
import VehicleSliderBlock from '@/components/VehicleSliderBlock.vue'
// Swiper
import { register } from 'swiper/element/bundle'
// Types
import type { Swiper as SwiperInterface } from 'swiper/swiper';
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

// Vehicles Map
const vehicles: Ref<Vehicles | undefined> = ref( undefined )


// Filtered Map
const vehiclesFiltered: ComputedRef<Vehicles> = computed( () => {
  if ( !vehicles.value ) {
    return new Map() as Vehicles
  }

  let result: Vehicles = new Map()

  for ( let k of vehicles.value.keys() ) {
    const vehicle = vehicles.value.get( k ) as Vehicle

    // Nation filter
    if ( nation.value && vehicle.nation !== nation.value ) {
      continue
    }

    // Type filter
    if ( vehicleType.value ) {
      const typeIndex = vehicle.tags.findIndex( ( vehicle: string ) => { 
        return vehicleType.value && ( vehicle.toLowerCase() === vehicleType.value.toLowerCase() )
      } )
      
      if ( typeIndex < 0 ) {
        continue
      }
    }

    if ( searchQuery.value ) {
      if ( vehicle.localization.mark[ locale.value ]?.toLowerCase().indexOf( searchQuery.value?.toLowerCase() ) < 0 ) {
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
  interface VehicleResponse {
    data   : {
      [ id: number ]: Vehicle
    }
    status : string
  }

  try {
    const { data } = await api.get<VehicleResponse>( 'vehicles' )
    if ( data.data ) {
      /* Тут нужно кое что просериализировать ( */
      for ( let i in data.data ) {
        data.data[ i ].id = i
      }

      vehicles.value = new Map( Object.entries( data.data ) )
      console.log( 'Vehicles', vehicles.value )
    }
  } catch ( errors ) {
    console.log( errors )
  }
}



// SLIDER ----------------------------------------------------------------------
const isSliderVisible: Ref<boolean> = ref( false )

const sliderVehicles: Ref<Vehicle[] | undefined> = ref()

const Swiper: Ref<SwiperInterface | null> = ref( null )
const SwiperInitialSlide: Ref<number> = ref( 0 )

const onSwiperInit = () => {
  const swiperEl = document.querySelector( 'swiper-container' ) as any

  if ( !swiperEl ) {
    return
  }

  if ( typeof swiperEl === 'object' && ( 'swiper' in swiperEl ) ) {
    Swiper.value = swiperEl.swiper as SwiperInterface
  }
}

const handleSlideNext = () => {
  if ( !Swiper.value ) {
    return
  }

  Swiper.value.slideNext()
}

const handleSlidePrev = () => {
  if ( !Swiper.value ) {
    return
  }

  Swiper.value.slidePrev()
}


// ..
const sliderTresholdIndexes = [ 
  -1, 
  0, 
  1, 
]

// ..
const showSlider = ( id: string ) => {
  if ( !vehiclesFiltered.value.size ) {
    return
  }

  const filteredIndex = vehiclesFilteredKeys.value.indexOf( id )

  sliderVehicles.value = []
  
  for ( let i of sliderTresholdIndexes ) {
    if ( vehiclesFilteredValues.value[ filteredIndex + i ] ) {
      sliderVehicles.value.push( vehiclesFilteredValues.value[ filteredIndex + i ] )
    }
  }

  SwiperInitialSlide.value = sliderVehicles.value.length >= 3 ? 1 : 0

  isSliderVisible.value = true
}

const hideSlider = () => {
  isSliderVisible.value = false
}


const onSwiperSlideChange = () => {
  if ( !Swiper.value ) {
    return
  }

  // ..
}
// /SLIDER




onMounted( async () => {
  // Swiper - register swiper
  register()

  // Send requests
  await Promise.all( [
    // Loading media path
    loadMediaPath(),
    // Loading nations
    loadNations(),
    // Loading vehicle types
    loadVehicleTypes(),
    // Loading vehicles
    loadVehicles(),
  ] )

  // ..
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
            @open="$vehicleId => showSlider( $vehicleId )"
          />
        </template>
      </Grid>
    </transition>
  </div>

  <Teleport to="body">
    <Transition name="component-fade-fast">
      <div 
        v-if="isSliderVisible"
        class="vehicles-slider"
      >
        <button 
          class="vehicles-slider__close"
          aria-labelledby="close"
          @click="hideSlider"
        >
          <svg
            class="vehicles-slider__close__icon"
            width="40"
            height="40"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use xlink:href="#svg-icon-close-cross" />
          </svg>
        </button>
        <swiper-container
          class="vehicle-slider-swiper"
          :loop="false"
          :slides-per-view="1" 
          :initial-slide="SwiperInitialSlide"
          @init="onSwiperInit"
          @slidechange="onSwiperSlideChange"
        >
          <swiper-slide
            v-for="( sliderVehicle ) in sliderVehicles"
            :key="`sldierVehicle_${ sliderVehicle.name }`"
            class="vehicle-slider-swiper__slide"
          >
            <VehicleSliderBlock 
              :vehicle="sliderVehicle"
              :nations="nations"
              :vehicle-types="vehicleTypes"
              :media-path="mediaPath"
            />
          </swiper-slide>
        </swiper-container>
        <div class="vehicle-slide-navigation">
          <button 
            class="vehicle-slide-navigation-l"
            :class="{
              'disabled': Swiper?.isBeginning
            }"
            @click="handleSlidePrev"
          >
            <svg
              class="vehicle-slide-navigation__icon"
              width="24"
              height="10"
              viewBox="0 120 512 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            ><use xlink:href="#svg-icon-chevron-compact" /></svg>
          </button>
          <button 
            class="vehicle-slide-navigation-r"
            :class="{
              'disabled': Swiper?.isEnd
            }"
            @click="handleSlideNext"
          >
            <svg
              class="vehicle-slide-navigation__icon"
              width="24"
              height="10"
              viewBox="0 120 512 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            ><use xlink:href="#svg-icon-chevron-compact" /></svg>
          </button>
        </div>
      </div>
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



// VEHICLES SLIDER -------------------------------------------------------------
.vehicles-slider {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  z-index: 1000;
  background: #{ $color-intensedarkblue-a75 };
  backdrop-filter: blur(4px);
}


.vehicles-slider__close {
  position: absolute;
  top: #{rem(16px)};
  right: #{rem(16px)};

  padding: #{rem(4px)};

  z-index: 10000;

  transition: all 0.1s linear;

  border: none;
  border-radius: 50%;

  color: var(--color-text);
  background: none;
  opacity: 0.75;
  cursor: pointer;
  appearance: none;
  
  &:hover {
    opacity: 1;
    background-color: var(--color-input-bg);
  }

  &::before {
    content: '';

    inset: #{rem(-16px)} #{rem(-16px)} #{rem(-16px)} #{rem(-16px)};
  }
}


.vehicles-slider__close__icon {
  display: block;
}


.vehicle-slider-swiper {
  height: 100%;
  width: 100%;
}

.vehicle-slider-swiper__slide {
  display: flex;
  overflow: auto;
  padding: #{rem(32px)} 0;
}



.vehicle-slide-navigation {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}

.vehicle-slide-navigation-l,
.vehicle-slide-navigation-r {
  position: absolute;
  top: 0;

  width: 5%;
  height: 100%;
  padding: 0;

  z-index: 10;

  border: none;

  color: var(--color-text);
  appearance: none;
  background: transparent;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: default;
  }

  @media only screen and (min-width: #{ rem(966px) }) {
    width: calc( ( 100% - 870px ) / 2 );
  }

  .vehicle-slide-navigation__icon {
    opacity: 0.5;
  }

  &:hover {
    .vehicle-slide-navigation__icon {
      opacity: 1;
    }
  }
}

.vehicle-slide-navigation__icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 48px;
  height: 20px;

  transition: opacity 0.1s linear;
}

.vehicle-slide-navigation-l {
  left: 0;
  cursor: w-resize;

  &:hover {
    background: linear-gradient(-90deg, #{ rgba(#fff, 0) }, #{ rgba(#fff, 0.05) });
  }

  .vehicle-slide-navigation__icon {
    transform: translate(-50%, -50%) rotate(90deg);
  }
}

.vehicle-slide-navigation-r {
  right: 0;
  cursor: e-resize;

  &:hover {
    background: linear-gradient(90deg, #{ rgba(#fff, 0) }, #{ rgba(#fff, 0.05) });
  }

  .vehicle-slide-navigation__icon {
    transform: translate(-50%, -50%) rotate(-90deg);
  }
}

// /VEHICLES SLIDER
</style>
