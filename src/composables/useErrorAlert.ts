/*
 * Это бы переписать на плагин по хорошему, чтоб не владывались композаблы.
 */

// Vue
import { ref, type Ref, computed, type ComputedRef } from 'vue'


// Alerts list
const errorAlerts: Ref<Error[]> = ref( [] )

const errorAlert: ComputedRef<Error | null> = computed( () => {
  if ( !errorAlerts.value.length ) {
    return null
  }

  return errorAlerts.value[ errorAlerts.value.length - 1 ]
} )


// Composable
export const useErrorAlert = () => {
  const showAlert = ( error: Error ) => {
    errorAlerts.value.push( error )
  }

  const closeAlert = () => {
    errorAlerts.value.pop()
  }

  return {
    errorAlerts,
    errorAlert,
    showAlert,
    closeAlert,
  }
}
