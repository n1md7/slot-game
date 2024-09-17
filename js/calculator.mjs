/**
 * import { Tween, Group, Easing, BlockType, ReelSymbol, WinnerType } from './types.mjs';
 * import { Reel } from './reel.mjs';
 */
import {
  AllSame,
  AnyBar,
  BARx1,
  BARx2,
  BARx3,
  Cherry,
  CherryOrSeven,
  IgnoreStartSymbolCount,
  Seven,
} from './constants.js';
import { payTable } from './payTable.mjs';

/**
 * Slot Calculator class. It's responsible for calculating the slot results
 * @param {Reel[]} reels
 *
 * @constructor
 */
export function Calculator(reels) {
  /**
   * @private
   * @readonly
   * @type {Checker}
   */
  this.checker = new Checker();

  /**
   * @description Get the visible rows
   * @private
   * @readonly
   * @returns {BlockType[][]}
   */
  this.getVisibleBlocks = () => {
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
   * @returns {WinnerType[]}
   */
  this.calculate = () => {
    /**
     * @description Winning combinations
     * @type {WinnerType[]}
     */
    const winners = [];

    for (const [rowIndex, blocks] of this.getVisibleBlocks().entries()) {
      const allSymbolsMatch = this.checker.allSymbolsMatch(blocks);
      const cherryOrSevenMatch = this.checker.cherryOrSevenCombination(blocks);
      const anyBarMatch = this.checker.anyBarCombination(blocks);

      switch (true) {
        case allSymbolsMatch: {
          const symbol = blocks.at(0).symbol;
          const money = payTable[symbol][rowIndex];

          winners.push({ type: AllSame, rowIndex, blocks, money });
          break;
        }
        case cherryOrSevenMatch: {
          const money = payTable[CherryOrSeven][rowIndex];
          winners.push({ type: CherryOrSeven, rowIndex, blocks, money });
          break;
        }
        case anyBarMatch: {
          const money = payTable[AnyBar][rowIndex];
          winners.push({ type: AnyBar, rowIndex, blocks, money });
          break;
        }
      }
    }

    return winners;
  };
}

function Checker() {
  /**
   * @description Check if all symbols match. If they do, return the symbol type otherwise null
   * @param {BlockType} first
   * @param {BlockType[]} blocks
   * @returns {boolean}
   */
  this.allSymbolsMatch = ([first, ...blocks]) => {
    return blocks.every((block) => block.symbol === first.symbol);
  };

  /**
   * @description Check if any bar combination is present
   * @param {BlockType[]} blocks
   * @returns {boolean}
   */
  this.anyBarCombination = (blocks) => {
    return blocks.every((block) => [BARx1, BARx2, BARx3].includes(block.symbol));
  };

  /**
   * @description Check if cherry or seven combination is present
   * @param {BlockType[]} blocks
   * @returns {boolean}
   */
  this.cherryOrSevenCombination = (blocks) => {
    return blocks.every((block) => [Cherry, Seven].includes(block.symbol));
  };
}
