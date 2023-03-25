<script setup lang="ts">
// Vue
import { ref, type Ref, defineProps, defineEmits } from 'vue'
// Types
import type { Vehicle, VehicleTypes, Nations } from '@/types/types'
// Utils
import { integerToRoman } from '@/utils/typography'
// Localization
import { useI18n } from 'vue-i18n'



// Props
const props = defineProps<{
  vehicle      : Vehicle
  nations      : Nations
  mediaPath   : string
  vehicleTypes : VehicleTypes
  style?       : any
}>()



// Composables
const { locale } = useI18n()



const getVehicleTypes = ( tags: string[] ) => {
  tags.forEach( ( tag: string, i: number ) => {
    tags[ i ] = tag.toLowerCase() 
  } )

  return tags
    .filter( ( tag: string ) => {
      return props.vehicleTypes && props.vehicleTypes[ tag ]
    } )
}

</script>



<template>
  <div 
    class="vehicle"
    :style="style"
  >
    <div class="vehicle-image">
      <span
        v-if="nations"
        class="vehicle-nation"
      >
        <img 
          class="vehicle-nation__icon"
          :src="`${ mediaPath }${ nations[ vehicle.nation ].icons.default }`"
          :alt="nations[ vehicle.nation ].localization.mark[ locale ]"
          :title="nations[ vehicle.nation ].localization.mark[ locale ]"
          width="214"
          height="126"
        >
      </span>
      <img 
        :src="`${ mediaPath }${ vehicle.icons.medium }`"
        class="vehicle-image__img"
        :alt="vehicle.localization.mark[ locale ]"
        :title="vehicle.localization.mark[ locale ]"
        loading="lazy"
        width="435"
        height="256"
      >
    </div>
    <div class="vehicle-body">
      <header class="vehicle-header">
        <small>
          <template v-if="vehicle.level > 10">
            ★
          </template>
          <template v-else>
            {{ integerToRoman( vehicle.level ) }}
          </template>
        </small>

        {{ vehicle.localization.mark[ locale ] }}
      </header>
      <template 
        v-if="vehicleTypes"
      >
        <aside
          v-for="v in getVehicleTypes( vehicle.tags )"
          :key="`vehicleType_${ vehicle.name }_${ v }`"
          class="vehicle-type"
        >
          {{ vehicleTypes[ v ].localization.mark[ locale ] }}
          <img 
            class="vehicle-type__icon"
            :src="`${ mediaPath }${ vehicleTypes[ v ].icons.default }`"
            :alt="vehicleTypes[ v ].localization.mark[ locale ]"
            :title="vehicleTypes[ v ].localization.mark[ locale ]"
            width="27"
            height="27"
          >
        </aside>
      </template>
    </div>
  </div>
</template>



<style lang="scss">

.vehicle {
  position: relative;
  overflow: hidden;
  background: #00000029;
  border: 1px solid #9fb5fc29;
  border-radius: 4px;
} 

.vehicle-image {
  position: relative;
  aspect-ratio: 20 / 10;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 22%;
    background: rgba(0, 0, 0, 0.1607843137);
  }

  .vehicle-image__img {
    width: 100%;
    height: auto;
    pointer-events: none;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}

.vehicle-nation {
  position: absolute;
  top: #{ rem( 16px ) };
  left: #{ rem( 16px ) };
  width: 18%;
  z-index: 1;
  cursor: help;

  .vehicle-nation__icon {
    display: block;
    width: 100%;
    height: auto;
  }
}


.vehicle-body {
  background: #00000029;
  border-radius: 0 0 2px 2px;
  padding: #{rem(6px)} #{rem(16px)} #{rem(12px)} #{rem(16px)};

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
}

.vehicle-header {
  font-family: $font-family-condensed;
  font-weight: 700;
  font-size: #{ rem(20px) };
  text-align: left;

  small {
    color: #AD7A07;
    font-size: 75%;
  }
}


.vehicle-type {
  display: inline-block;
  vertical-align: top;
  font-weight: 400;
  font-family: $font-family-condensed;
  font-size: #{ rem(14px) };
  line-height: 1;

  color: #6d82a3;

  .vehicle-type__icon {
    display: inline-block;
    vertical-align: middle;
    width: 27px;
    height: 27px;
    margin: #{rem(-3px)} 0 #{rem(-3px)} #{rem(2px)};
  }
}

</style>
