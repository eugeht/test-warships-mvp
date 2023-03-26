/**
 * API Layer
 */
import axios, { type AxiosResponse } from 'axios'


// Response interface
export type ApiResponse<T> = AxiosResponse<T>


// Api client
export const api = axios.create( {
  baseURL : 'https://vortex.worldofwarships.eu/api/encyclopedia/en/',
  headers : {
    'Access-Control-Allow-Origin'  : '*',
    'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
} )
