<script setup lang="ts">
// Types
import type { Vehicle, VehicleTypes, Nations } from '@/types/types'
// Utils
import { integerToRoman } from '@/utils/typography'
import { handleImageError } from '@/utils/images'
// Localization
import { useI18n } from 'vue-i18n'



// Props
defineProps<{
  vehicle       : Vehicle
  mediaPath?    : string
  nations?      : Nations
  vehicleTypes? : VehicleTypes
}>()



// Composables
const { locale } = useI18n()

</script>



<template>
  <div class="vehicle-slider-block">
    <div class="vehicle-slider-block__inner">
      <div class="vehicle-slider-block-picture">
        <img 
          class="vehicle-slider-block-picture__img"
          :src="`${ mediaPath }${ vehicle.icons.large }`"
          :alt="vehicle.localization.mark[ locale ]"
          :title="vehicle.localization.mark[ locale ]"
          width="870"
          height="512"
          @error="handleImageError"
        >
      </div>
      <div class="vehicle-slider-block-body">
        <hgroup class="vehicle-slider-block-header">
          <h2 class="vehicle-slider-block-header__title">
            <small class="vehicle-slider-block-header__level">
              <template v-if="vehicle.level > 10">
                ★
              </template>
              <template v-else>
                {{ integerToRoman( vehicle.level ) }}
              </template>
            </small>
            <span class="swiper-no-swiping">
              {{ vehicle.localization.mark[ locale ] }}
            </span>
          </h2>
          <p class="vehicle-slider-block-header__hint">
            {{ vehicle.localization.shortmark[ locale ] }}
          </p>
        </hgroup>
        <div
          v-if="nations"
          class="vehicle-slider-block-nation"
        >
          <img 
            class="vehicle-slider-block-nation__icon"
            :src="`${ mediaPath }${ nations[ vehicle.nation ].icons.tiny }`"
            :alt="nations[ vehicle.nation ].localization.mark[ locale ]"
            :title="nations[ vehicle.nation ].localization.mark[ locale ]"
            width="27"
            height="27"
          >
          {{ nations[ vehicle.nation ].localization.mark[ locale ] }}
        </div>
        <div class="vehicle-slider-block-description">
          <span class="swiper-no-swiping">
            {{ vehicle.localization.description[ locale ] }}
          </span>
        </div>
        <div 
          v-if="vehicleTypes && vehicle?.vehicleType"
          class="vehicle-slider-block-type"
        >
          {{ vehicleTypes[ vehicle.vehicleType ].localization.mark[ locale ] }}
          <img 
            class="vehicle-slider-block-type__icon"
            :src="`${ mediaPath }${ vehicleTypes[ vehicle.vehicleType ].icons.default }`"
            :alt="vehicleTypes[ vehicle.vehicleType ].localization.mark[ locale ]"
            :title="vehicleTypes[ vehicle.vehicleType ].localization.mark[ locale ]"
            width="27"
            height="27"
          >
        </div>
      </div>
    </div>
  </div>
</template>



<style lang="scss">

.vehicle-slider-block {
  position: relative;

  width: #{ rem(870px) }; // 966 viewport
  max-width: 90%;
  margin: auto;

  @media (pointer: coarse) {
    .swiper-no-swiping {
      pointer-events: none;
    }
  }

  .vehicle-slider-arrow-r {
    color: red;
  }

  &::before {
    content: '';

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    border: 1px solid #{ $color-white-a15 };
    border-radius: var(--input-border-radius);
    background: #{ $color-intenseblue };
    /* stylelint-disable-next-line */
    -webkit-mask-image: linear-gradient(0deg, black 50%, transparent 100%);
    mask-image: linear-gradient(0deg, black 50%, transparent 100%);

    @media only screen and (min-width: #{ rem(640px) }) {
      /* stylelint-disable-next-line */
      -webkit-mask-image: linear-gradient(0deg, black 30%, transparent 80%);
      mask-image: linear-gradient(0deg, black 30%, transparent 80%);
    }
  }
}

.vehicle-slider-block__inner {
  position: relative;
}

.vehicle-slider-block-picture {
  position: relative;

  padding-bottom: 40%;
}

.vehicle-slider-block-picture__img {
  position: absolute;
  bottom: 0;
  left: 0;

  width: 100%;
  height: auto;
}

.vehicle-slider-block-body {
  padding: 0 #{rem(24px)} #{rem(16px)} #{rem(24px)};
}


.vehicle-slider-block-header__title {
  display: flex;
  margin: 0;

  flex-direction: row;
  align-items: flex-end;

  font-family: #{ $font-family-condensed };
  font-size: #{ rem(38px) };
  line-height: 1;
}

.vehicle-slider-block-header__level {
  margin-right: #{rem(4px)};

  color: var(--color-text-active);
  font-size: 80%;
}


.vehicle-slider-block-header__hint {
  color: var(--color-text-hint);
}


.vehicle-slider-block-type {
  display: flex;

  margin: #{rem(16px)} 0 0 0;

  flex-direction: row;
  align-items: center;
}

.vehicle-slider-block-type__icon {
  margin-left: #{rem(2px)};
  margin-bottom: #{rem(-2px)};
}


.vehicle-slider-block-nation {
  display: flex;

  flex-direction: row;
  align-items: center;

  font-family: #{ $font-family-condensed };
  font-size: #{rem(16px)};
}

.vehicle-slider-block-nation__icon {
  width: #{rem(27px)};
  height: #{rem(27px)};
  margin-right: #{8px};
}


.vehicle-slider-block-description {
  margin: #{rem(12px)} 0 0 0;

  font-size: #{rem(16px)};
  line-height: 1.4;
}

</style>
