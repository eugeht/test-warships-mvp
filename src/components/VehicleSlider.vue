<script setup lang="ts">
// Vue
import { ref, type Ref } from 'vue'
// Components
import VehicleSliderBlock from '@/components/VehicleSliderBlock.vue'
// Types
import type { Swiper as SwiperInterface } from 'swiper/swiper'
import type { Vehicle, VehicleTypes, Nations } from '@/types/types'



// Props
const props = defineProps<{
  vehicleId : number
  mediaPath : string
  nations   : Nations
  
  vehicles             : Vehicle[]
  vehicleTypes         : VehicleTypes
  vehiclesFilteredKeys : string[]
}>()



// Emits
const emit = defineEmits<{( e: 'close' ): void }>()



// Swiper
const Swiper: Ref<SwiperInterface | null> = ref( null )
const SwiperInitialSlide: Ref<number> = ref( 0 )


// Slider
const sliderVehicles: Ref<Vehicle[]> = ref( [] )

// eslint-disable-next-line array-bracket-newline
const sliderTresholdIndexes = [ -1, 0, 1 ]


// Set base elements
for ( let i of sliderTresholdIndexes ) {
  if ( props.vehicles[ props.vehicleId + i ] ) {
    sliderVehicles.value.push( props.vehicles[ props.vehicleId + i ] )
  }
}

SwiperInitialSlide.value = sliderVehicles.value.length >= 3 ? 1 : 0



// Init
const onSwiperInit = () => {
  const swiperEl = document.querySelector( 'swiper-container' ) as any

  if ( !swiperEl ) {
    return
  }

  if ( typeof swiperEl === 'object' && ( 'swiper' in swiperEl ) ) {
    Swiper.value = swiperEl.swiper as SwiperInterface

    // Keyboard
    Swiper.value.on( 'keyPress', ( swiper, keyCode ) => {
      if ( Number( keyCode ) === 27 ) {
        handleCloseSlider()
      }
    } )
  }
}




const onSwiperSlidePrev = () => {
  if ( !Swiper.value || !sliderVehicles.value?.length ) {
    return
  }

  const firstId = sliderVehicles.value[ 0 ].id as string
  const filteredIndex = props.vehiclesFilteredKeys.indexOf( firstId )

  if ( props.vehicles[ filteredIndex - 1 ] ) {
    sliderVehicles.value.unshift( props.vehicles[ filteredIndex - 1 ] )
    Swiper.value.slideTo( Swiper.value.activeIndex + 1, 0 )
  }
}


const onSwiperSlideNext = () => {
  if ( !Swiper.value || !sliderVehicles.value?.length ) {
    return
  }

  const lastId = sliderVehicles.value[ sliderVehicles.value?.length - 1 ].id as string
  const filteredIndex = props.vehiclesFilteredKeys.indexOf( lastId )

  if ( props.vehicles[ filteredIndex + 1 ] ) {
    sliderVehicles.value.push( props.vehicles[ filteredIndex + 1 ] )
    Swiper.value.isEnd = false
  }
}



// Events
const handleCloseSlider = () => {
  emit( 'close' )
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
// /Events

</script>



<template>
  <div 
    class="vehicles-slider"
  >
    <button 
      class="vehicles-slider__close"
      aria-labelledby="close"
      @click="handleCloseSlider"
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
      :keyboard="{
        enabled: true,
      }"
      @init="onSwiperInit"
      @slideprevtransitionend="onSwiperSlidePrev"
      @slidenexttransitionstart="onSwiperSlideNext"
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
</template>



<style lang="scss">

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

  @media only screen and (min-width: #{ rem(966px) }) {
    width: calc( ( 100% - 870px ) / 2 );
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: default;
  }

  .vehicle-slide-navigation__icon {
    opacity: 0.5;
  }

  &:hover {
    .vehicle-slide-navigation__icon {
      opacity: 1;
    }
  }

  &:focus {
    outline: none;
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

</style>
