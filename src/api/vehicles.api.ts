// API
import { api } from './index'
// Types
import type { VehicleTypes, Vehicle } from '@/types/types'



// Response interface
interface VehicleTypesResponse {
  data   : VehicleTypes
  status : string
}



// Load vehicle types list
export const getVehicleTypes = async () => {
  try {
    const { data } = await api.get<VehicleTypesResponse>( 'vehicle_types_common' )
    if ( !data.data ) {
      return { error: 'no data' }
    }

    const preparedData = Object.keys( data.data )
      .reduce( ( acc: VehicleTypes, key ) => {
        acc[ key.toLowerCase() ] = data.data[ key ]
        return acc
      }, {} )

    return {
      data: preparedData,
    }

    // console.log( 'VehicleTypes', preparedData )
  } catch ( error ) {
    return { error }
  }
}



//
interface VehicleResponse {
  data   : {
    [ id: number ]: Vehicle
  }
  status : string
}



// Load vehicle types list
export const getVehicles = async () => {
  try {
    const { data } = await api.get<VehicleResponse>( 'vehicles' )
    if ( !data.data ) {
      return { error: 'no data' }
    }

    return {
      data: data.data,
    }

    // console.log( 'VehicleTypes', preparedData )
  } catch ( error ) {
    return { error }
  }
}


export default {
  getVehicleTypes,
  getVehicles,
}
