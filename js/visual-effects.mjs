import { Easing, Tween } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { Reel } from './reel.mjs';

/**
 * Slot Effects class. It's responsible for slot effects
 * @param {Reel[]} reels
 * @constructor
 */
export function VisualEffects(reels) {
  /**
   * Highlight the winning block
   * @private
   * @readonly
   * @param {BlockOptions} block
   * @param {number} reelIndex
   */
  this.highlightBlock = (block, reelIndex) => {
    block.color = {
      r: 0,
      g: 0,
      b: 0,
      a: 255,
    };

    reels[reelIndex].animations.add(
      new Tween(block.color)
        .to(
          {
            r: 255,
            g: 255,
            b: 255,
          },
          300,
        )
        .easing(Easing.Cubic.InOut)
        .repeat(Infinity)
        .start(),
    );
  };

  /**
   * @description Highlight the winning blocks
   * @public
   * @readonly
   * @param {BlockType[]} blocks
   */
  this.highlight = (blocks) => {
    for (const [reelIndex, { block }] of blocks.entries()) {
      this.highlightBlock(block, reelIndex);
    }
  };
}
