// Wait
/* eslint-disable-next-line */
export const wait = ( ms: number ) => new Promise( ( r ) => setTimeout( r, ms ) )


// Retry
export async function* retrier( { attempts = Infinity, delay = 100 } ) {
  for ( let i = 0; i < attempts; i++ ) {
    yield i
    /* eslint-disable-next-line */
    await wait( delay )
  }
}
