/**
 * @description Get empty array with specified length
 * @param {number} length
 * @returns {number[]}
 */
export function createEmptyArray(length) {
  return Array.from({ length }).map((_, i) => i);
}

/**
 * @description Create SelectBox option element and append to parent
 * @param {string} value
 * @param {HTMLSelectElement} parent
 */
export function createOption(value, parent) {
  const option = document.createElement('option');
  option.value = value;
  option.innerText = value;
  parent.appendChild(option);
}

/**
 * @description Convert hex color value to object
 * @param {string} hexValue
 * @returns {{r: number, b: number, g: number}}
 */
export function hexToObject(hexValue) {
  if (!hexValue.startsWith('#')) {
    throw new Error('Invalid hex value: ' + hexValue);
  }

  return {
    r: parseInt(hexValue.slice(1, 3), 10),
    g: parseInt(hexValue.slice(3, 5), 10),
    b: parseInt(hexValue.slice(5, 7), 10),
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
