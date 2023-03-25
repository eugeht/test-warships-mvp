// Vue
import { createApp } from 'vue'
// Store
import { createPinia } from 'pinia'
// Localization
import { i18n } from '@/localization'
// Components
import App from './App.vue'
// Directives
import clickOutside from '@/directives/clickOutside'
// Common styles
import '@/assets/sass/styles.scss'



const app = createApp( App )


// Error handler
app.config.errorHandler = ( error, instance, info ) => {
  /* сюда бы добавить какой-то сервис для отлова ошибок в слак или телеграм */
  console.error( 'Error', error, instance, info )
}


app
  .use( createPinia() )
  .use( i18n )


app.directive( 'click-outside', clickOutside )


app.mount( '#app' )
