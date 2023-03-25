// i18n
import { createI18n } from 'vue-i18n'



// Тут можно вынести все в поддиректории, но тк текста мало пусть будет простой объект
const messages = {
  'cs'    : {},
  'de'    : {},
  'en'    : {},
  'es'    : {},
  'es_mx' : {},
  'fr'    : {},
  'it'    : {},
  'ja'    : {},
  'ko'    : {},
  'nl'    : {},
  'pl'    : {},
  'pt_br' : {},
  'ru'    : {},
  'th'    : {},
  'tr'    : {},
  'uk'    : {},
  'zh_cn' : {},
  'zh_sg' : {},
  'zh_tw' : {},
}


// Create localization
const i18n = createI18n( {
  legacy         : false,
  locale         : 'ru',
  fallbackLocale : 'en',
  messages       : messages,
} )



export default i18n
