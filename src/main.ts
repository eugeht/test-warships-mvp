// Vue
import { createApp } from 'vue'
// Store
import { createPinia } from 'pinia'
// Localization
import i18n from '@/localization/i18n'
// Components
import App from './App.vue'
// Common styles
import '@/assets/sass/styles.scss'



const app = createApp( App )

app
  .use( createPinia() )
  .use( i18n )

app.mount( '#app' )
