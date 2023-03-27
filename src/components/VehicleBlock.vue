<script setup lang="ts">
// Types
import type { Vehicle, VehicleTypes, Nations } from '@/types/types'
// Utils
import { integerToRoman } from '@/utils/typography'
import { handleImageError } from '@/utils/images'
// Localization
import { useI18n } from 'vue-i18n'



// Props
const props = defineProps<{
  vehicle?      : Vehicle
  nations?      : Nations
  mediaPath?    : string
  vehicleTypes? : VehicleTypes
  style?        : any
}>()



// Emits
const emit = defineEmits<{( e: 'open', value: string ): void }>()



// Composables
const { locale } = useI18n()



const handleClick = () => {
  if ( !props.vehicle || !props.vehicle.id ) {
    return
  }

  emit( 'open', props.vehicle.id )
}

</script>



<template>
  <div 
    class="vehicle"
    :class="{
      'vehicle--active': vehicle
    }"
    :style="style"
    :title="vehicle?.localization.description[ locale ]"
    @click="handleClick"
  >
    <div class="vehicle-image">
      <span
        v-if="nations"
        class="vehicle-nation"
      >
        <img 
          v-if="vehicle"
          class="vehicle-nation__icon"
          :src="`${ mediaPath }${ nations[ vehicle.nation ].icons.default }`"
          :alt="nations[ vehicle.nation ].localization.mark[ locale ]"
          :title="nations[ vehicle.nation ].localization.mark[ locale ]"
          width="214"
          height="126"
        >
      </span>
      <template 
        v-if="vehicleTypes && vehicle?.vehicleType"
      >
        <aside class="vehicle-type">
          {{ vehicleTypes[ vehicle.vehicleType ].localization.mark[ locale ] }}
          <img 
            class="vehicle-type__icon"
            :src="`${ mediaPath }${ vehicleTypes[ vehicle.vehicleType ].icons.default }`"
            :alt="vehicleTypes[ vehicle.vehicleType ].localization.mark[ locale ]"
            :title="vehicleTypes[ vehicle.vehicleType ].localization.mark[ locale ]"
            width="27"
            height="27"
          >
        </aside>
      </template>
      <img 
        v-if="vehicle"
        :src="`${ mediaPath }${ vehicle.icons.medium }`"
        class="vehicle-image__img"
        :alt="vehicle.localization.mark[ locale ]"
        :title="vehicle.localization.mark[ locale ]"
        loading="lazy"
        width="435"
        height="256"
        @error="handleImageError"
      >
    </div>
    <div class="vehicle-body">
      <header class="vehicle-header">
        <template v-if="vehicle">
          <small>
            <template v-if="vehicle.level > 10">
              ★
            </template>
            <template v-else>
              {{ integerToRoman( vehicle.level ) }}
            </template>
          </small>
          {{ vehicle.localization.mark[ locale ] }}
        </template>
        <template v-else>
          &nbsp;
        </template>
      </header>
    </div>
  </div>
</template>



<style lang="scss">

.vehicle {
  position: relative;

  min-width: 0;

  transition: 0.2s linear background;

  border: 1px solid #{ $color-lighterblue-a15 };
  border-radius: var(--input-border-radius);
  background: #{ $color-black-a15 };

  &.vehicle--active {
    cursor: zoom-in;

    &:hover {
      background: #{$color-blue-a15};
    }
  }
} 


.vehicle-image {
  position: relative;
  aspect-ratio: 20 / 10;
  pointer-events: none;

  &::after {
    content: "";

    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 22%;
    background: #{ $color-black-a15 };
  }
}

.vehicle-image__img {
  position: absolute;
  bottom: 0;
  left: 0;

  width: 100%;
  height: auto;

  z-index: 1;

  transition: transform 0.2s linear;
  pointer-events: none;
  transform-origin: 50% 75%;

  .vehicle.vehicle--active:hover & {
    transform: scale(1.02);
  }
}

.vehicle-nation {
  position: absolute;
  top: #{ rem( 16px ) };
  left: #{ rem( 16px ) };

  width: 18%;

  z-index: 1;
  cursor: help;
}

.vehicle-nation__icon {
  display: block;
  width: 100%;
  height: auto;
}



.vehicle-type {
  position: absolute;
  top: #{ rem( 8px ) };
  right: #{ rem( 16px ) };

  font-weight: 400;
  font-family: $font-family-condensed;
  font-size: #{ rem(14px) };
  line-height: 1;

  color: var(--color-text-hint);
}

.vehicle-type__icon {
  display: inline-block;
  width: 27px;
  height: 27px;
  margin: #{rem(1px)} #{rem(-1px)} #{rem(2px)} 0 ;
  vertical-align: middle;
}


.vehicle-body {
  display: flex;
  padding: #{rem(6px)} #{rem(16px)} #{rem(12px)} #{rem(16px)};

  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  border-radius: 0 0 var(--input-border-radius-inner) var(--input-border-radius-inner);
  background: #{ $color-black-a15 };

  .vehicle.vehicle--active:hover & {
    background: #{ $color-black-a15 };
  }
}

.vehicle-header {
  width: 100%;
  overflow: hidden;

  font-family: $font-family-condensed;
  font-weight: 700;
  font-size: #{ rem(20px) };
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;

  small {
    display: inline-block;
    margin-right: #{rem(2px)};

    font-size: 75%;
    color: var(--color-text-active);
    vertical-align: middle;
  }
}

</style>
