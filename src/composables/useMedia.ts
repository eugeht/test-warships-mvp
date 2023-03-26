// Vue
import { ref, type Ref } from 'vue'
// Api
import { api } from '@/api'


//
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
    } catch ( errors ) {
      console.log( errors )
    }
  }

  return {
    mediaPath,
    loadMediaPath,
  }
}
