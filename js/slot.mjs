import { Reel } from './reel.mjs';
import { createEmptyArray } from './utils.mjs';

/**
 * import { ReelOptions, ReelSymbols, ColorOptions, BlockOptions, PaddingOptions, Mode } from './types.mjs';
 */

/**
 * @param {Object} options - Slot options
 * @param {HTMLCanvasElement} options.canvas - Canvas instance
 * @param {Mode} options.mode - Slot mode
 * @param {ColorOptions} options.color - Slot colors
 * @param {BlockOptions} options.block - Slot block options
 * @param {ReelSymbols} options.symbols - Slot symbols object
 * @param {ReelOptions} options.reel - Slot reels
 *
 * @constructor
 */
export function Slot({ mode, canvas, color, block, symbols, reel }) {
  /**
   * @private
   * @type {CanvasRenderingContext2D}
   */
  this.ctx = canvas.getContext('2d');

  /**
   * @private
   * @readonly
   * @type {Reel[]}
   */
  this.reels = [];

  /**
   * @private
   * @type {boolean}
   */
  this.isSpinning = false;

  /**
   * @public
   * @readonly
   * @type {number}
   */
  this.width = block.width * reel.count + reel.padding.x * 2 + block.lineWidth * (reel.count - 1);

  /**
   * @public
   * @readonly
   * @type {number}
   */
  this.height = block.height * 2;

  /**
   * @private
   * @description Paint slot background
   * @returns {void}
   * @readonly
   */
  this.paintBackground = () => {
    this.ctx.fillStyle = color.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
  };

  /**
   * @public
   * @readonly
   */
  this.start = () => {
    this.reels = createEmptyArray(reel.count).map((index) => {
      return new Reel({
        ctx: this.ctx,
        height: this.height,
        padding: reel.padding,
        animationTime: reel.animationTime,
        mode,
        color,
        block,
        symbols,
        index,
      });
    });

    this.paintBackground();
    this.reels.forEach((reel) => reel.reset());
  };

  /**
   * @public
   * @readonly
   */
  this.spin = () => {
    if (this.isSpinning) return;

    this.reels.forEach((reel) => reel.spin());
  };

  /**
   * @public
   * @readonly
   * @param {DOMHighResTimeStamp} time - Time in milliseconds
   */
  this.update = (time) => {
    this.isSpinning = this.reels.some((reel) => reel.isSpinning);

    for (const reel of this.reels) {
      reel.update(time);
    }
  };
}
