/**
 * @typedef {object} IIdGenerator
 * @property {(size?: number) => string[] | number[]} createArray Create random array of dictionary chars
 * @property {(size?: number) => string} create Create random string of dictionary chars
 */

/**
 * @typedef {object} IdGeneratorDependencies
 * @property {Crypto=} crypto
 * 
 * @typedef {object} IdGeneratorConfigParams
 * @property {Dictionary} dictionary Array of chars is faster than string
 * - String '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'
 * - Array of string ['-','0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','_','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
 * - Array of char codes [45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]
 * @property {number} randomPoolSize Max 65536
 * 
 * @typedef {object} IdGeneratorStates
 * @property {number} dictionarySize
 * @property {number} randomPoolOffset
 * @property {RandomPool} randomPool
 * @property {Buffer=} buffer
 * @property {number[]} randomInts
 * @property {string[] | number[]} chars
 * 
 * @typedef {IdGeneratorDependencies
 *  & IdGeneratorConfigParams
 *  & IdGeneratorStates
 * } IdGeneratorProperties
 * 
 * @typedef {Partial<IdGeneratorDependencies & IdGeneratorConfigParams>} IdGeneratorParams
 */

/**
 * @typedef {string | string[] | number[]} Dictionary Array of chars is faster than string
 * - String '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'
 * - Array of string ['-','0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','_','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
 * - Array of char codes [45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]
 */

/**
 * @typedef {number[]} RandomPool
 */
