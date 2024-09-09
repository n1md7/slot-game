import { Easing, Tween } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { createEmptyArray } from './utils.mjs';

/**
 * import { Reel, ModeStrategy } from './reel.mjs';
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
  this.generateReelSymbols = () => {
    reel.animations.removeAll(); // Reset old animations if any

    const visibleBlocks = 2;
    // Calculated to Y position to start the animation, 1st block is partially visible or not visible at all
    const startY = Math.abs((visibleBlocks + 1 - reel.animationBlockslength) * reel.options.block.height);

    reel.animationBlocks = createEmptyArray(reel.animationBlockslength).map((index) => {
      const coords = { yOffset: (index - reel.animationBlockslength + visibleBlocks) * reel.options.block.height };
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

      return { symbol, coords, block: reel.options.block };
    });
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
  this.generateReelSymbols = () => {
    throw new Error('Not implemented');
  };
}

/**
 * @description Factory function to create slot mode strategies.
 * @param {Reel} reel - Reel instance
 * @returns {Record<Mode, ModeStrategy>} - Slot mode strategies
 * @constructor
 */
export function Modes(reel) {
  return {
    random: new RandomMode(reel),
    fixed: new FixedMode(reel),
  };
}
