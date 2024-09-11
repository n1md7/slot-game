import { Easing, Tween } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { createEmptyArray, hexToObject } from './utils.mjs';
import { IgnoreStartSymbolCount } from './constants.js';

/**
 * import { ModeStrategy, Tween, Easing } from './types.mjs';
 * import { Reel } from './reel.mjs';
 */

/**
 * @description Random mode strategy for generating reel symbols.
 *
 * @class RandomMode
 * @implements {ModeStrategy}
 * @param {Reel} reel - Reel instance
 *
 * @constructor
 */
export function RandomMode(reel) {
  /**
   * @private
   * @readonly
   * @description Get random symbol from the reel symbols
   * @returns {ReelSymbol}
   */
  this.getRandomSymbol = () => {
    const totalSymbols = reel.symbolKeys.length;
    const randomIndex = Math.floor(Math.random() * totalSymbols);

    return reel.symbolKeys[randomIndex];
  };

  /**
   * @public
   * @readonly
   * @returns {void}
   */
  this.genReelSymbols = () => {
    const visibleBlocks = reel.options.rows;
    // Calculated to Y position to start the animation
    const startY = Math.abs((visibleBlocks + IgnoreStartSymbolCount - reel.totalBlocks) * reel.options.block.height);

    /**
     * @description Create an array of next symbols with their animation coordinates
     * @type {BlockType[]}
     */
    const nextSymbols = createEmptyArray(reel.totalBlocks).map((index) => {
      const coords = { yOffset: (index - reel.totalBlocks + visibleBlocks) * reel.options.block.height };
      const symbol = this.getRandomSymbol();
      const isFirst = index === 0;

      const animation = new Tween(coords)
        .to(
          {
            yOffset: startY + coords.yOffset,
          },
          reel.options.animationTime,
        )
        .easing(Easing.Back.Out)
        .start();

      // Just one Tween event to handle the completion, they all will finish at the same time
      if (isFirst) {
        animation.onComplete(() => {
          reel.isSpinning = false;
        });
      }

      reel.animations.add(animation);

      const block = { ...reel.options.block }; // Copy the block options
      block.color = hexToObject(reel.options.color.background);

      return {
        symbol,
        coords,
        block,
      };
    });
    // During the initial animation, there are no previous symbols to replace, so we use the nextSymbols array as a placeholder
    const prevSymbols = reel.blocks.length > 0 ? reel.blocks : nextSymbols;
    const size = prevSymbols.length;
    // Replace the last visible blocks on the nextSymbols array to keep the animation smooth
    for (let i = 0; i < visibleBlocks; i++) {
      nextSymbols[size - visibleBlocks + i].symbol = prevSymbols[i + IgnoreStartSymbolCount].symbol;
    }

    // Update the animation blocks
    reel.blocks = nextSymbols;
  };
}

/**
 * @description Fixed mode strategy for generating reel symbols.
 *
 * @class FixedMode
 * @implements {ModeStrategy}
 * @param {Reel} reel - Reel instance
 *
 * @constructor
 */
export function FixedMode(reel) {
  /**
   * @public
   * @readonly
   * @returns {void}
   */
  this.genReelSymbols = () => {
    throw new Error('Not implemented');
  };
}

/**
 * @description Mode composition for slot machine.
 * @param {Reel} reel - Reel instance
 * @param {Mode} activeMode - Active mode
 *
 * @constructor
 */
export function Modes(reel, activeMode) {
  /**
   * @readonly
   * @private
   */
  this.fixed = new FixedMode(reel);

  /**
   * @readonly
   * @private
   */
  this.random = new RandomMode(reel);

  /**
   * @public
   * @readonly
   * @returns {RandomMode|FixedMode}
   */
  this.getCurrent = () => {
    switch (activeMode) {
      case 'fixed':
        return this.fixed;
      case 'random':
        return this.random;
      default:
        throw new Error(`Mode ${activeMode} is not defined`);
    }
  };
}
