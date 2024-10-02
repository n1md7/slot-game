/**
 * The number of invisible symbols on the reel. These symbols are used for the Back.Out easing effect.
 *
 * If the value is 3, the first 3 symbols on the reel will be invisible. The 4th symbol will be the first visible symbol.
 * We start the evaluating the winning combinations from the 4th symbol to the end of the visible symbols.
 *
 * @constant
 * @type {number}
 */
export const IgnoreStartSymbolCount = 3;

/**
 * @constant
 * @type {'1xBAR'}
 */
export const BARx1 = '1xBAR';
/**
 * @constant
 * @type {'2xBAR'}
 */
export const BARx2 = '2xBAR';
/**
 * @constant
 * @type {'3xBAR'}
 */
export const BARx3 = '3xBAR';
/**
 * @constant
 * @type {'Seven'}
 */
export const Seven = 'Seven';
/**
 * @constant
 * @type {'Cherry'}
 */
export const Cherry = 'Cherry';

/**
 * @constant
 * @type {'AnyBar'}
 */
export const AnyBar = 'AnyBar';
/**
 * @constant
 * @type {'AllSame'}
 */
export const AllSame = 'AllSame';
/**
 * @constant
 * @type {'CherryOrSeven'}
 */
export const CherryOrSeven = 'CherryOrSeven';

export const LineOne = 0;
export const LineTwo = 1;
export const LineThree = 2;
export const LineFour = 3;
export const LineFive = 4;

export const ModeFixed = 'fixed';
export const ModeRandom = 'random';

export const tableSymbols = [Cherry, Seven, CherryOrSeven, BARx3, BARx2, BARx1, AnyBar];
export const tableLines = [LineOne, LineTwo, LineThree, LineFour, LineFive];
