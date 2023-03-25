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
        class="chip chip--nation chip--nation--preview"
      >
        <img 
          class="chip__icon"
          :src="`${ mediaPath }${ nations[ vehicle.nation ].icons.small }`"
          width="214"
          height="126"
        >
        <!-- {{ nations[ item.nation ].localization.mark[ locale ] }} -->
      </span>
      <img 
        :src="`${ mediaPath }${ vehicle.icons.default }`"
        loading="lazy"
        width="214"
        height="126"
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
      <div 
        v-if="vehicleTypes"
        class="vehicle__info"
      >
        <span
          v-for="v in getVehicleTypes( vehicle.tags )"
          :key="`vehicleType_${ vehicle.name }_${ v }`"
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



<style lang="scss">

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
</style>
