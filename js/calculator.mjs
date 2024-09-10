import { Easing, Tween } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';

/**
 * import { Tween, Group, Easing, BlockType, ReelSymbol } from './types.mjs';
 * import { Reel } from './reel.mjs';
 */
import { IgnoreStartSymbolCount } from './constants.js';

/**
 * Slot Calculator class. It's responsible for calculating the slot results
 *
 * @constructor
 */
export function Calculator() {
  /**
   * @private
   * @readonly
   * @type {Checker}
   */
  this.checker = new Checker();

  /**
   * @description Get the visible rows
   * @param {Reel[]} reels
   * @private
   * @readonly
   * @returns {BlockType[][]}
   */
  this.getVisibleBlocks = (reels) => {
    /** @type {BlockType[][]} */
    const rows = [];
    const start = IgnoreStartSymbolCount;
    const end = IgnoreStartSymbolCount + reels[0].options.rows;
    for (let row = start; row < end; row++) {
      /** @type {BlockType[]} */
      const blocks = [];

      for (const reel of reels) {
        blocks.push(reel.blocks[row]);
      }

      rows.push(blocks);
    }

    return rows;
  };

  /**
   * @description Calculate the slot results
   * @readonly
   * @public
   * @param {Reel[]} reels
   */
  this.calculate = (reels) => {
    const rows = this.getVisibleBlocks(reels);
    for (const [rowIndex, blocks] of rows.entries()) {
      const winnerSymbol = this.checker.allSymbolsMatch(blocks);

      if (winnerSymbol) {
        console.info('Winner symbol:', winnerSymbol);
        for (const [reelIndex, { block }] of blocks.entries()) {
          reels[reelIndex].animations.removeAll();
          block.color.r = 0;
          block.color.g = 0;
          block.color.b = 0;
          reels[reelIndex].animations.add(
            new Tween(block.color)
              .to({ r: 255, g: 255, b: 255 }, 300)
              .easing(Easing.Cubic.InOut)
              .repeat(Infinity)
              .start(),
          );
        }
      }
    }
  };
}

function Checker() {
  /**
   * @description Check if all symbols match. If they do, return the symbol type otherwise null
   * @param {BlockType} first
   * @param {BlockType[]} blocks
   * @returns {null | ReelSymbol }
   */
  this.allSymbolsMatch = ([first, ...blocks]) => {
    const match = blocks.every((block) => block.symbol === first.symbol);

    if (!match) return null;

    return first.symbol;
  };
}
