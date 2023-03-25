// i18n
import { createI18n, type LocaleMessages, type VueMessageType } from 'vue-i18n'
// Types
import type { SupportedLocales } from '@/localization/types'
// Utils
import { setLocaleHtmlAttr } from '@/localization/utils'
// Config
import { languageNames } from '@/localization/config'



// Тут можно вынести все в поддиректории, но тк текста мало пусть будет простой объект
const messages: {
  [ key in SupportedLocales ]: LocaleMessages<VueMessageType>
} = {
  'cs': {
    selectVehicleType : 'Vyberte typ vozidla',
    selectNation      : 'Vyberte národ',
    search            : 'Vyhledávání',
  },
  'de': {
    selectVehicleType : 'Fahrzeugtyp auswählen',
    selectNation      : 'Nation auswählen',
    search            : 'Suchen',
  },
  'en': {
    selectVehicleType : 'Select vehicle type',
    selectNation      : 'Select nation',
    search            : 'Search',
  },
  'es': {
    selectVehicleType : 'Seleccionar tipo de vehículo',
    selectNation      : 'Seleccionar nación',
    search            : 'Buscar',
  },
  'es_mx': {
    selectVehicleType : 'Seleccionar tipo de vehículo',
    selectNation      : 'Seleccionar nación',
    search            : 'Buscar',
  },
  'fr': {
    selectVehicleType : 'Sélectionnez le type de véhicule',
    selectNation      : 'Sélectionnez un pays',
    search            : 'Recherche',
  },
  'it': {
    selectVehicleType : 'Seleziona il tipo di veicolo',
    selectNation      : 'Seleziona nazione',
    search            : 'Ricerca',
  },
  'ja': {
    selectVehicleType : '車種を選択',
    selectNation      : '国を選択',
    search            : '検索',
  },
  'ko': {
    selectVehicleType : '차량 유형 선택',
    selectNation      : '국가 선택',
    search            : '찾다',
  },
  'nl': {
    selectVehicleType : 'Selecteer voertuigtype',
    selectNation      : 'Selecteer natie',
    search            : 'Zoekopdracht',
  },
  'pl': {
    selectVehicleType : 'Wybierz typ pojazdu',
    selectNation      : 'Wybierz naród',
    search            : 'Szukaj',
  },
  'pt_br': {
    selectVehicleType : 'Selecione o tipo de veículo',
    selectNation      : 'Selecione a nação',
    search            : 'Procurar',
  },
  'ru': {
    selectVehicleType : 'Выберите тип судна',
    selectNation      : 'Выберите нацию',
    search            : 'Поиск',
  },
  'th': {
    selectVehicleType : 'เลือกประเภทรถ',
    selectNation      : 'เลือกประเทศ',
    search            : 'ค้นหา',
  },
  'tr': {
    selectVehicleType : 'Araç tipini seçin',
    selectNation      : 'Ulus seçin',
    search            : 'Aramak',
  },
  'uk': {
    selectVehicleType : 'Виберіть тип човна',
    selectNation      : 'Виберіть націю',
    search            : 'Пошук',
  },
  'zh_cn': {
    selectVehicleType : '選擇車型',
    selectNation      : '選擇國家',
    search            : '搜索',
  },
  'zh_sg': {
    selectVehicleType : '選擇車型',
    selectNation      : '選擇國家',
    search            : '搜索',
  },
  'zh_tw': {
    selectVehicleType : '選擇車型',
    selectNation      : '選擇國家',
    search            : '搜索',
  },
}



// Create localization
const i18n = createI18n( {
  legacy         : false,
  locale         : 'ru',
  fallbackLocale : 'en',
  messages       : messages,
} )



export { 
  i18n,
  setLocaleHtmlAttr,
  languageNames,
  type SupportedLocales
}
