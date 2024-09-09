import { Group } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { Canvas } from './canvas.mjs';
import { Modes } from './mode.mjs';

/**
 * import { ReelSymbols, ColorOptions, BlockOptions, PaddingOptions, BlockType, Group, Tween, Easing, Mode } from './types.mjs';
 */

/**
 * @description Slot Reel
 * @param {Object} options - Reel options
 * @param {Mode} options.mode - Slot mode
 * @param {number} options.height - Reel height
 * @param {CanvasRenderingContext2D } options.ctx - Canvas rendering context
 * @param {number} options.index - Reel index, 0, 1, 2 required for the X offset calculation
 * @param {number} options.animationTime - Reel animation time in milliseconds
 * @param {ColorOptions} options.color - Reel colors
 * @param {BlockOptions} options.block - Reel block options
 * @param {PaddingOptions} options.padding - Reel block padding
 * @param {ReelSymbols} options.symbols - Slot symbols object
 *
 * @constructor
 */
export function Reel(options) {
  /**
   * @public
   * @readonly
   */
  this.options = options;

  /**
   * @private
   * @readonly
   */
  this.mode = options.mode;

  /**
   * @redonly
   * @private
   */
  this.modes = new Modes(this);

  /**
   * @private
   * @readonly
   */
  this.canvas = new Canvas({
    ctx: options.ctx,
    width: options.block.width,
    color: options.color,
    height: options.height,
    xOffset: options.index * options.block.width + options.padding.x + options.index * options.block.lineWidth,
    symbols: options.symbols,
  });

  /**
   * @public
   * @readonly
   * @type {Group}
   */
  this.animations = new Group();

  /**
   * @public
   * @readonly
   * @type {ReelSymbol[]} - Reel symbols keys
   */
  this.symbolKeys = Object.keys(options.symbols);

  /**
   * @public
   * @readonly
   * @description Animation blocks size. It will be 6 for 1st reel, 7 for 2nd, and 8 for the 3rd, etc.
   * @type {number}
   */
  this.animationBlockslength = 6 + options.index;

  /**
   * @private
   * @type {BlockType[]}
   */
  this.animationBlocks = [];

  /**
   * @public
   * @type {boolean}
   */
  this.isSpinning = false;

  /**
   * @private
   * @readonly
   * @returns {void}
   */
  this.drawBlocks = () => {
    for (const block of this.animationBlocks) {
      this.canvas.draw(block);
    }
  };

  /**
   * @public
   * @readonly
   * @description Reset the reel to the initial state
   */
  this.reset = () => {
    const mode = this.modes[this.mode];
    if (!mode) {
      throw new Error(`Mode ${this.mode} is not defined`);
    }

    mode.generateReelSymbols();
    this.drawBlocks();
  };

  /**
   * @public
   * @description Update loop
   * @param {DOMHighResTimeStamp} time
   */
  this.update = (time) => {
    if (!this.isSpinning) return;

    this.canvas.clearBlock();
    this.animations.update(time);
    this.drawBlocks();
  };

  /**
   * @public
   * @readonly
   * @description Spin the reel
   * @returns {void}
   */
  this.spin = () => {
    this.reset();
    this.isSpinning = true;
  };
}
