// Set a11y document attr
export const setLocaleHtmlAttr = ( loc: string ) => {
  document.getElementsByTagName( 'html' )[ 0 ].lang = loc
}
