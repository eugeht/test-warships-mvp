<script setup lang="ts">
// Components
import TheSvgSpritemap from '@/components/TheSvgSpritemap.vue'
import TheHeader from '@/components/TheHeader.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
/* Вообще тут обычно vue-router, но так как одна страница только - пусть будет так */
import HomeView from '@/views/HomeView.vue'
// Composables
import { useMedia } from '@/composables/useMedia'
import { useErrorAlert } from '@/composables/useErrorAlert'
// Localization
import { useI18n } from 'vue-i18n'
import { setLocaleHtmlAttr } from '@/localization'



// Composables
const { errorAlert } = useErrorAlert()



// LOCALIZATION ----------------------------------------------------------------
const { locale } = useI18n()


// Saved locale processing
const savedLocale = localStorage.getItem( 'locale' )

if ( savedLocale ) {
  locale.value = savedLocale

  setLocaleHtmlAttr( locale.value )
}
// /LOCALIZATION



// MEDIA -----------------------------------------------------------------------
const { loadMediaPath } = useMedia()

void loadMediaPath()
// /MEDIA

</script>



<template>
  <!-- SVG sprite -->
  <TheSvgSpritemap />

  <!-- Main Header -->
  <TheHeader />

  <main class="page">
    <!-- Collection -->
    <HomeView />
  </main>

  <Transition 
    name="component-fade"
    mode="in-out"
  >
    <ErrorAlert 
      v-if="errorAlert"
      :error="errorAlert"
    />
  </Transition>
</template>



<style lang="scss">
// PAGE ------------------------------------------------------------------------
.page {
  position: relative;

  display: flex;

  overflow: auto;

  flex-direction: column;

  flex: 1 1 auto;
}

// /PAGE

</style>
