// Vue
import { createApp } from 'vue'
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

// Localization
app.use( i18n )

// Click helper directive
app.directive( 'click-outside', clickOutside )


// Mount
app.mount( '#app' )
