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
