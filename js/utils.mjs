/**
 * @description Get empty array with specified length
 * @param {number} length
 * @returns {number[]}
 */
export function createEmptyArray(length) {
  return Array.from({ length }).map((_, i) => i);
}

/**
 * @description Convert hex color value to object
 * @param {string} hexValue
 * @param {number} radix
 * @returns {{r: number, b: number, g: number, a: number}}
 */
export function hexToObject(hexValue, radix = 10) {
  if (!hexValue.startsWith('#')) {
    throw new Error('Invalid hex value: ' + hexValue);
  }

  return {
    r: parseInt(hexValue.slice(1, 3), radix),
    g: parseInt(hexValue.slice(3, 5), radix),
    b: parseInt(hexValue.slice(5, 7), radix),
    a: parseInt(hexValue.slice(7, 9), radix) || 255,
  };
}

/**
 * @description Convert single decimal number to hex string
 * @param {number} value
 * @returns {string}
 * @example decToHex(255) // 'ff'
 */
export function decToHex(value) {
  return Math.floor(value).toString(16).padStart(2, '0');
}

/**
 * @description Wait for specified time
 * @param {number} ms - Time in milliseconds to wait
 * @returns {Promise<unknown>}
 */
export const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const createImage = ({ src, width, content }) => {
  return `<img src="${src}" alt="${content}" width="${width}" class="img-thumbnail rounded" />`;
};
