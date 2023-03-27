// Vue
import { ref, type Ref, computed, type ComputedRef } from 'vue'


// Alerts list
const errorAlerts: Ref<unknown[]> = ref( [] )

const errorAlert: ComputedRef<unknown | null> = computed( () => {
  if ( !errorAlerts.value.length ) {
    return null
  }

  return errorAlerts.value[ errorAlerts.value.length - 1 ]
} )


// Composable
export const useErrorAlert = () => {
  const showAlert = ( error: unknown ) => {
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
