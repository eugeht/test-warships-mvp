<script setup lang="ts">
// Components
import TheSvgSpritemap from '@/components/TheSvgSpritemap.vue'
import TheHeader from '@/components/TheHeader.vue'
/* Вообще тут обычно vue-router, но так как одна страница только - пусть будет так */
import HomeView from '@/views/HomeView.vue'
// Localization
import { useI18n } from 'vue-i18n'
import { setLocaleHtmlAttr } from '@/localization'



// LOCALIZATION ----------------------------------------------------------------
const { locale } = useI18n()


// Saved locale processing
const savedLocale = localStorage.getItem( 'locale' )

if ( savedLocale ) {
  locale.value = savedLocale

  setLocaleHtmlAttr( locale.value )
}
// /LOCALIZATION

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
</template>



<style lang="scss">
.page {
  position: relative;

  overflow: auto;

  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}
</style>
