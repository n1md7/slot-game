import {
  AnyBar,
  BARx1,
  BARx2,
  BARx3,
  Cherry,
  CherryOrSeven,
  LineFive,
  LineFour,
  LineOne,
  LineThree,
  LineTwo,
  Seven,
  tableLines,
  tableSymbols,
} from './constants.js';

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
export const waitForSec = (sec) => new Promise((resolve) => setTimeout(resolve, sec * 1000));

export const createImage = ({ src, width, content }) => {
  return `<img src="${src}" alt="${content}" width="${width}" class="img-thumbnail rounded" />`;
};

export const createPayTable = (symbols, payTable, parent) => {
  tableBuilder({
    class: 'table table-sm table-bordered table-hover',
    border: 1,
  })
    .setHeader({
      Symbol: { key: 'symbol', width: 130 },
      'Line 01': { key: LineOne.toString(), width: 100 },
      'Line 02': { key: LineTwo.toString(), width: 100 },
      'Line 03': { key: LineThree.toString(), width: 100 },
      'Line 04': { key: LineFour.toString(), width: 100 },
      'Line 05': { key: LineFive.toString(), width: 100 },
    })
    .setBody(
      tableSymbols.map((symbol) =>
        tableLines.reduce(
          (row, line) => ({
            ...row,
            [line]: `$<b>${payTable[symbol][line]}</b>`,
          }),
          { symbol },
        ),
      ),
    )
    .on('symbol', (tr) => {
      const width = 40;
      const content = tr.dataset.content;
      switch (content) {
        case Cherry:
          tr.innerHTML = createImage({ src: symbols.Cherry.src, content, width });
          break;
        case Seven:
          tr.innerHTML = createImage({ src: symbols.Seven.src, content, width });
          break;
        case CherryOrSeven:
          tr.innerHTML =
            '<div class="d-flex justify-content-center gap-2">' +
            createImage({ src: symbols.Cherry.src, content: Cherry, width }) +
            createImage({ src: symbols.Seven.src, content: Seven, width }) +
            '</div>';
          break;
        case BARx3:
          tr.innerHTML = createImage({ src: symbols['3xBAR'].src, content, width });
          break;
        case BARx2:
          tr.innerHTML = createImage({ src: symbols['2xBAR'].src, content, width });
          break;
        case BARx1:
          tr.innerHTML = createImage({ src: symbols['1xBAR'].src, content, width });
          break;
        case AnyBar:
          tr.innerHTML =
            '<div class="d-flex justify-content-center gap-2">' +
            createImage({ src: symbols['1xBAR'].src, content: BARx1, width }) +
            createImage({ src: symbols['2xBAR'].src, content: BARx2, width }) +
            createImage({ src: symbols['3xBAR'].src, content: BARx3, width }) +
            '</div>';
          break;
      }
    })
    .appendTo(parent);
};
