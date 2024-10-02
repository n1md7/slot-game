import { Group } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { Canvas } from './canvas.mjs';
import { Modes } from './mode.mjs';
import { IgnoreStartSymbolCount } from './constants.js';

/**
 * import { ReelSymbols, ColorOptions, BlockOptions, PaddingOptions, BlockType, Group, Tween, Easing, Mode } from './types.mjs';
 */

/**
 * Slot Reel class. It's responsible for drawing and animating the slot reel
 *
 * @param {Object} options - Reel options
 * @param {Mode} options.mode - Slot mode
 * @param {number} options.height - Reel height
 * @param {CanvasRenderingContext2D } options.ctx - Canvas rendering context
 * @param {number} options.index - Reel index, 0, 1, 2 required for the X offset calculation
 * @param {number} options.animationTime - Reel animation time in milliseconds
 * @param {Function} options.animationFunction - Reel animation easing function
 * @param {number} options.rows - Slot reels rows
 * @param {ColorOptions} options.color - Reel colors
 * @param {BlockOptions} options.block - Reel block options
 * @param {PaddingOptions} options.padding - Reel block padding
 * @param {ReelSymbols} options.symbols - Slot symbols object
 * @param {ReelSymbol[]} options.fixedSymbols - Slot fixed symbols array, for fixed mode
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
  this.mode = new Modes(this);

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
   * Total blocks to draw on the reel
   *
   * @public
   * @readonly
   * @type {number}
   */
  this.totalBlocks = 2 * options.rows + options.index + IgnoreStartSymbolCount;

  /**
   * @public
   * @type {BlockType[]}
   */
  this.blocks = [];

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
    for (const block of this.blocks) {
      this.canvas.draw(block);
    }
  };

  /**
   * Reset the reel to the initial state
   *
   * @public
   * @readonly
   */
  this.reset = () => {
    this.animations.removeAll();
    this.mode.genByMode(options.mode);
    this.drawBlocks();
    this.isSpinning = false;
  };

  /**
   * Update the reel, this method is called on each frame
   *
   * @public
   * @param {DOMHighResTimeStamp} time
   */
  this.update = (time) => {
    this.canvas.clearBlock();
    this.animations.update(time);
    this.drawBlocks();
  };

  /**
   * @public
   * @readonly
   * @returns {void}
   */
  this.spin = () => {
    this.reset();
    this.isSpinning = true;
  };
}
