<script setup lang="ts">
// Vue
import { defineEmits } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
// Localization
import { useI18n } from 'vue-i18n'
import { languageNames } from '@/localization/config'
import { setLocaleHtmlAttr } from '@/localization/utils'



// Emits
const emit = defineEmits<{( e: 'close', event: Event ): void }>()


// Composables
const { availableLocales, locale } = useI18n()



// Handle close emit
const handleClose = ( event: Event ) => {
  emit( 'close', event )
}



// Set locale and save to localStorage
const setLocale = ( event: Event ) => {
  if ( !event.target ) {
    return
  }

  localStorage.setItem( 'locale', ( event.target as HTMLSelectElement ).value )

  setLocaleHtmlAttr( ( event.target as HTMLSelectElement ).value )

  handleClose( event )
}
</script>



<template>
  <form 
    v-on-click-outside="$event => handleClose( $event )"
    class="locale-form"
  >
    <label 
      v-for="availableLocale in availableLocales" 
      :key="`locale_${ availableLocale }`" 
      :value="availableLocale" 
      :selected="availableLocale === locale"
      class="locale-form-label"
    >
      <input
        v-model="locale"
        type="radio"
        name="locale"
        :value="availableLocale"
        class="locale-form-label__input"
        @change="( $event ) => setLocale( $event )"
      >
      <span class="locale-form-label__text">
        {{ languageNames[ availableLocale ]?.nativeName || availableLocale }}
      </span>
    </label>
  </form>
</template>



<style lang="scss">
$locale-form-breakpoint: #{ rem(420px) };



.locale-form {
  width: 100vw;
  padding: rem(16px);
  display: flex;

  flex-flow: row wrap;
  white-space: nowrap;
  font-family: $font-family;
  font-weight: 400;
  font-size: rem(16px);

  @media only screen and (min-width: #{ $locale-form-breakpoint }) {
    width: rem(360px);
  }
}


.locale-form-label {
  position: relative;

  padding: rem(4px);

  flex: 1 0 50%;
  cursor: pointer;

  &:hover {
    .locale-form-label__text {
      opacity: 1;
    }
  }
}


.locale-form-label__input {
  position: absolute;
  top: 0;
  height: 1px;
  width: 1px;
  opacity: 0;

  &:checked {
    & + .locale-form-label__text {
      color: #d39810;
      opacity: 1;
    }
  }
}

.locale-form-label__text {
  transition: all 0.2s linear;
  opacity: 0.6;
}
</style>
