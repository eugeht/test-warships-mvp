// API
import { api } from './index'
// Types
import type { Nation, Nations } from '@/types/types'



// Response interface
interface NationsResponse {
  data   : Nation[]
  status : string
}



// Get nations
export const getNations = async () => {
  try {
    const { data } = await api.get<NationsResponse>( 'nations' )
    if ( !data.data ) {
      return { error: 'no data' }
    }

    const preparedData = data.data
      .filter( nation => {
        return !nation.tags.includes( 'hidden' )
      } )
      .reduce( ( acc: Nations, currentValue ) => {
        acc[ currentValue.name ] = currentValue
        return acc
      }, {} )

    return {
      data: preparedData,
    }

    // console.log( 'Nations', nations.value )
  } catch ( error ) {
    return { error }
  }
}


export default {
  getNations,
}
