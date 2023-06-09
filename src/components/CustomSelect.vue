<script setup lang="ts">
// Vue
import { ref, type Ref } from 'vue'
// Localization
import { useI18n } from 'vue-i18n'
// Types
import type { VehicleTypes, Nations } from '@/types/types'



// Props
defineProps<{
  placeholder : string
  value       : string | null
  showIcon?   : boolean
  mediaPath?  : string
  options?    : | VehicleTypes | Nations
}>()



// Emits
const emit = defineEmits<{( 
    e: 'select', value: string 
  ): void 
  ( 
    e: 'clear'
  ): void
}>()



// Composables
const { locale } = useI18n()




// Dropdown
const isDropdownVisible: Ref<boolean> = ref( false )

const toggleDropdownVisible = () => {
  isDropdownVisible.value = !isDropdownVisible.value
}


// Handle Close emit
const handleSelection = ( value: string ) => {
  emit( 'select', value )

  isDropdownVisible.value = false
}


// Handle Clear emit
const handleClear = () => {
  emit( 'clear' )

  isDropdownVisible.value = false
}

</script>



<template>
  <div
    class="custom-select"
  >
    <div 
      class="custom-select-value"
      :class="{
        loading: !options
      }"
      :tabindex="options ? 0 : undefined"
      @keypress.space="toggleDropdownVisible"
      @click="options ? toggleDropdownVisible() : undefined"
    >
      <div 
        v-if="value && options"
        class="custom-select-value__value"
      >
        <span 
          v-if="showIcon"
          class="custom-select__icon"
        >
          <img 
            v-if="'tiny' in options[ value ].icons"
            :src="`${ mediaPath }${ ( options as Nations )[ value ].icons.tiny }`"
            width="20"
            height="20"
            :alt="options[ value ].localization.mark[ locale ]"
            :title="options[ value ].localization.mark[ locale ]"
          >
          <img 
            v-else-if="'default' in options[ value ].icons"
            :src="`${ mediaPath }${ ( options as VehicleTypes )[ value ].icons.default }`"
            width="20"
            height="20"
            :alt="options[ value ].localization.mark[ locale ]"
            :title="options[ value ].localization.mark[ locale ]"
          >
        </span>
        {{ options[ value ].localization.mark[ locale ] }}
      </div>
      <div 
        v-else
        class="custom-select-value__value custom-select-value__value--placeholder"
      >
        {{ placeholder }}
      </div>
      <button 
        v-if="value"
        class="home-filters-filter__btn"
        @click.stop="handleClear"
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
      <svg
        v-else-if="!options"
        class="custom-select__loader"
        width="18"
        height="18"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <use xlink:href="#svg-icon-loader" />
      </svg>
      <svg
        v-else
        class="custom-select__arrow"
        width="16"
        height="16"
        viewBox="0 -20 200 220"
      >
        <use xlink:href="#svg-icon-chevron-up" />
      </svg>
    </div>
    <ul 
      v-if="isDropdownVisible && options"
      v-click-outside="toggleDropdownVisible"
      class="custom-select-list"
    >
      <li 
        v-for="option in options" 
        :key="`customSelect_${ option.name }`" 
        :value="option.name" 
        class="custom-select-list__item"
        :class="{
          'active': option.name === value
        }"
        tabindex="0"
        @keypress.space="handleSelection( option.name )"
        @click="handleSelection( option.name )"
      >
        <span 
          v-if="showIcon"
          class="custom-select__icon"
        >
          <img 
            v-if="'tiny' in options[ option.name ].icons"
            :src="`${ mediaPath }${ ( options as Nations )[ option.name ].icons?.tiny }`"
            width="20"
            height="20"
            :alt="options[ option.name ].localization.mark[ locale ]"
            :title="options[ option.name ].localization.mark[ locale ]"
          >
          <img 
            v-else-if="'default' in options[ option.name ].icons"
            :src="`${ mediaPath }${ ( options as VehicleTypes )[ option.name ].icons?.default }`"
            width="20"
            height="20"
            :alt="options[ option.name ].localization.mark[ locale ]"
            :title="options[ option.name ].localization.mark[ locale ]"
          >
        </span>
        {{ options[ option.name ].localization.mark[ locale ] }}
      </li>
    </ul>
  </div>
</template>



<style lang="scss">

.custom-select {
  position: relative;
}


.custom-select-value {
  position: relative;

  display: block;
  width: 100%;
  height: 1.8em;
  padding: var(--input-padding);
  margin: 0;

  border: none;
  border-radius: var(--input-border-radius);

  color: var(--color-text);

  font-family: $font-family-condensed;

  font-size: var(--input-font-size);
  line-height: var(--input-line-height);
  cursor: pointer;
  background: var(--color-input-bg);

  &.loading {
    cursor: wait;
  }

  &:focus {
    outline: solid 2px var(--color-text-active);
    outline-offset: -2px;
  }
}


.custom-select-value__value {
  display: block;

  line-height: 1.4;

  &.custom-select-value__value--placeholder {
    opacity: 0.4;
  }
}


.custom-select__arrow {
  position: absolute;
  top: 50%;
  right: #{ rem( 5px ) };

  transform: translate(0, -50%);
  pointer-events: none;
  opacity: 0.5;
}


.custom-select__loader {
  position: absolute;
  top: 50%;
  right: #{ rem( 5px ) };

  transform: translate(0, -50%);
  opacity: 0.5;

  animation: 2s linear custom-select-loader-rotate infinite;
}

@keyframes custom-select-loader-rotate {
  to {
    transform: translate(0, -50%) rotate(360deg);
  }
}


.custom-select__icon {
  display: inline-block;
  width: #{ rem( 20px ) };
  height: #{ rem( 20px ) };
  margin-right: #{ rem(8px) };
  vertical-align: top;
}


.custom-select-list {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;

  display: block;
  padding: #{ rem( 4px ) }  #{ rem( 8px ) };
  margin: #{ rem( 4px ) } #{ rem( -2px ) } 0;

  z-index: 100;

  border-radius: var(--input-border-radius);

  font-family: $font-family-condensed;
  list-style: none;
  background: #{ $color-darkerblue };
  box-shadow: 0 #{ rem( 2px ) } #{ rem( 4px ) } #{ $color-black-a30 };
}


.custom-select-list__item {
  display: block;
  padding: #{ rem( 4px ) } #{ rem( 2px ) };

  font-size: #{rem(16px)};
  color: var(--color-text-a50);
  cursor: pointer;

  &.active {
    color: var(--color-text-active);
  }

  &:not(.active):hover {
    color: var(--color-text);
  }
}
</style>
