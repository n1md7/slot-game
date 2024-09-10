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
  const { ctx, width, height } = options;

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
    ctx.clearRect(this.xOffset, 0, width, height);
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

    /*ctx.strokeStyle = options.color.border;
    ctx.lineWidth = block.lineWidth;
    ctx.fillStyle = options.color.background;
    ctx.fillRect(this.xOffset, yOffset, width, height);
    ctx.drawImage(options.symbols[symbol], this.xOffset + padding, yOffset + padding, symbolWidth, symbolHeight);
    ctx.strokeRect(this.xOffset, yOffset, width, height);*/

    const width = block.width;
    const height = block.height;
    const rotate = block.rotate || 0;
    const { r, g, b } = block.color;
    const color = `#${decToHex(r)}${decToHex(g)}${decToHex(b)}`;

    // Save the canvas state before drawing the block
    ctx.save();

    // Set the styles for the block
    ctx.strokeStyle = options.color.border;
    ctx.lineWidth = block.lineWidth;
    ctx.fillStyle = color;

    // Translate the canvas to the block's center for rotation
    const xCenter = this.xOffset + width / 2;
    const yCenter = yOffset + height / 2;

    // Translate to the block's center and apply rotation
    ctx.translate(xCenter, yCenter);
    ctx.rotate(rotate * (Math.PI / 180)); // Apply the rotation

    // Draw the rotated block (fillRect and strokeRect) and the symbol
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.drawImage(options.symbols[symbol], -symbolWidth / 2, -symbolHeight / 2, symbolWidth, symbolHeight);
    ctx.strokeRect(-width / 2, -height / 2, width, height);

    // Restore the canvas state after drawing the block
    ctx.restore();
  };
}
