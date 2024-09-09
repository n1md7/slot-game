import { Easing, Tween } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { createEmptyArray } from './utils.mjs';
import { IgnoreStartSymbolCount } from './constants.js';

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
  this.getReelSymbols = () => {
    reel.animations.removeAll(); // Reset old animations if any

    const visibleBlocks = reel.options.rows;
    // Calculated to Y position to start the animation
    const startY = Math.abs(
      (visibleBlocks + IgnoreStartSymbolCount - reel.animationBlockslength) * reel.options.block.height,
    );

    const prevSymbols = reel.animationBlocks;
    const nextSymbols = createEmptyArray(reel.animationBlockslength).map((index) => {
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

      return {
        symbol,
        coords,
        block: reel.options.block,
      };
    });

    const size = prevSymbols.length;

    // During the initial animation, there are no previous symbols to replace
    if (size !== 0) {
      // Replace the last visible blocks on the nextSymbols array to keep the animation smooth
      for (let i = 0; i < visibleBlocks; i++) {
        nextSymbols[size - visibleBlocks + i].symbol = prevSymbols[i + IgnoreStartSymbolCount].symbol;
      }
    }

    // Update the animation blocks
    reel.animationBlocks = nextSymbols;
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
  this.getReelSymbols = () => {
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
