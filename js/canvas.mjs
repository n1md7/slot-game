/**
 * import {ColorOptions} from './reel.mjs';
 */

import { decToHex } from './utils.mjs';

/**
 * @description Custom Canvas wrapper for drawing blocks
 * @param {Object} options - Block options
 * @param {CanvasRenderingContext2D } options.ctx - Canvas rendering context
 * @param {number} options.xOffset - X position to draw the block on the canvas
 * @param {number} options.width - Block width
 * @param {number} options.height - Block height
 * @param {ColorOptions} options.color - Color options
 * @param {ReelSymbols} options.symbols - Slot symbols object
 *
 * @constructor
 */
export function Canvas(options) {
  /**
   * @private
   * @type {number}
   */
  this.xOffset = options.xOffset;

  /**
   * @public
   * @description Clear entire block from the canvas
   * @returns {void}
   */
  this.clearBlock = () => {
    options.ctx.clearRect(this.xOffset, 0, options.width, options.height);
  };

  /**
   * @description Draw image block on the canvas
   * @param {BlockType} options - Block options
   */
  this.draw = ({ block, symbol, coords: { yOffset } }) => {
    if (!options.symbols[symbol]) {
      throw new Error(`Symbol ${symbol} is not defined in the symbols object`);
    }

    const padding = block.padding + block.lineWidth;
    const symbolWidth = block.width - padding * 2;
    const symbolHeight = block.height - padding * 2;

    options.ctx.strokeStyle = options.color.border;
    options.ctx.lineWidth = block.lineWidth;

    if (block.color) {
      const { r, g, b, a } = block.color;
      options.ctx.fillStyle = `#${decToHex(r)}${decToHex(g)}${decToHex(b)}${decToHex(a)}`;
      options.ctx.fillRect(this.xOffset, yOffset, options.width, options.height);
    }

    options.ctx.drawImage(
      options.symbols[symbol],
      this.xOffset + padding,
      yOffset + padding,
      symbolWidth,
      symbolHeight,
    );
    options.ctx.strokeRect(this.xOffset, yOffset, options.width, options.height);
  };
}
