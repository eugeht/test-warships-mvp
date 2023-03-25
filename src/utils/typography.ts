/**
 * Capitalize string first letter only
 * @param str 
 * @returns 
 */
export const capitalize = ( str: string ) => {
  return str.charAt( 0 ).toUpperCase() + str.slice( 1 )
}



/**
 * Integer to Roman numerals conversion
 * @param str 
 * @returns 
 */
const romanNumeralsMap = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };

export const integerToRoman = ( num: number ) => {
  let result = ''

  Object.entries( romanNumeralsMap ).forEach( ( [ 
    letter, 
    n, 
  ] ) => {
    result += letter.repeat( Math.floor( num / n ) )
    num %= n
  } )
  return result;
}
