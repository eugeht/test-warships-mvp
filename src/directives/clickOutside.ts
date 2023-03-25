export default {
  mounted( el: any, binding: any ) {
    el.clickOutsideEvent = function( event: Event ) {
      if ( !event || !binding.value ) {
        return
      }

      console.log( 'binding', binding )

      if ( !( el === event.target || el.contains( event.target ) ) ) {
        binding.value( event, el )
      }
    }

    setTimeout( () => {
      document.body.addEventListener( 'click', el.clickOutsideEvent )
    }, 100 )
  },
  unmounted( el: any ) {
    document.body.removeEventListener( 'click', el.clickOutsideEvent )
  },
}
