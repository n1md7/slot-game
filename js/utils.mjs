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
