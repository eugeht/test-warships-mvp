/* 
 * Вообще сюда не стоит вкладывать другой композабл, 
 * но писать плагин под алерты, которые вероятно делать вообще не надо было пожалел времени =)
*/
// Vue
import { ref, type Ref } from 'vue'
// Api
import { api } from '@/api'
// Composables
import { useErrorAlert } from '@/composables/useErrorAlert'


// Composable
const { showAlert } = useErrorAlert()


// State
const mediaPath: Ref<string | undefined> = ref()



// Composable
export const useMedia = () => {
  const loadMediaPath = async () => {
    interface MediaResponse {
      data   : string
      status : string
    }
  
    try {
      const { data } = await api.get<MediaResponse>( 'media_path' )
      if ( data.data ) {
        mediaPath.value = data.data
        // console.log( 'MediaPath', mediaPath )
      }
    } catch ( error ) {
      if ( error instanceof Error ) {
        showAlert( error )
      }
    }
  }

  return {
    mediaPath,
    loadMediaPath,
  }
}
