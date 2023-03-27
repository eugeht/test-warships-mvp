import { retrier } from './helpers'



// eslint-disable-next-line require-await
export const createImage = async ( src: string ) => {
  return new Promise( ( resolve, reject ) => {
    const newImage = document.createElement( 'image' )

    // Create img
    const sourceSrc = src
    if ( sourceSrc ) {
      const img = document.createElement( 'img' )
      img.addEventListener( 'load', () => {
        img.remove()
        resolve( true )
      } )
      img.addEventListener( 'error', () => {
        img.remove()
        reject( new Error() )
      } )

      newImage.appendChild( img )

      img.src = sourceSrc
    }
  } )
}



export async function handleImageError( event: Event ) {
  const targetImg = event.target as HTMLImageElement

  const maxAttempts = 3
  const emptyPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  const originalImage = targetImg.src

  // Set empty pixel and retry reuploading original image
  targetImg.src = emptyPixel

  for await ( const attempt of retrier( { attempts: maxAttempts, delay: 3000 } ) ) {
    try {
      // Trying to reupload image
      const image = await createImage( originalImage )
      if ( image ) {
        // eslint-disable-next-line no-self-assign
        targetImg.src = originalImage

        targetImg.classList.add( 'loaded' )
      }
    } catch ( e ) {
      // Fixing image to empty pixel
      if ( attempt === ( maxAttempts - 1 ) ) {
        targetImg.src = emptyPixel
      }
    }
  }
}
