import { Reel } from './reel.mjs';
import { createEmptyArray, waitFor } from './utils.mjs';
import { Calculator } from './calculator.mjs';
import { AllSame, AnyBar, CherryOrSeven } from './constants.js';
import { payTable } from './pay-table.mjs';

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
   * @type {Calculator}
   */
  this.calculator = new Calculator(reel);

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
   * @private
   * @type {boolean}
   */
  this.checking = false;

  /**
   * @public
   * @readonly
   * @type {number}
   */
  this.width = block.width * reel.cols + reel.padding.x * 2 + block.lineWidth * (reel.cols - 1);

  /**
   * @public
   * @readonly
   * @type {number}
   */
  this.height = block.height * reel.rows;

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
    this.reels = createEmptyArray(reel.cols).map((index) => {
      return new Reel({
        ctx: this.ctx,
        height: this.height,
        padding: reel.padding,
        animationTime: reel.animationTime,
        rows: reel.rows,
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
    if (this.isSpinning || this.checking) return;

    this.reels.forEach((reel) => reel.spin());

    waitFor(reel.animationTime).then(() => this.evaluateWin());
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

  /**
   * @private
   * @readonly
   */
  this.evaluateWin = () => {
    this.checking = true;

    const winners = this.calculator.calculate(this.reels);

    if (!winners.length) {
      this.checking = false;
      return;
    }

    console.group('Winners');
    const totalWin = winners.reduce((acc, { money }) => acc + money, 0);
    for (const winner of winners) {
      // We have a winner, let's highlight the blocks
      this.highlightBlocks(winner.blocks);

      console.info(`Winner: ${winner.type}, line: ${winner.rowIndex}, money: ${winner.money}`);
    }

    console.info(`Total win: ${totalWin}`);
    console.groupEnd();

    // Let's keep user from spinning again while we are highlighting the blocks
    // We add a short delay to make the animation more visible and clear that the user won
    waitFor(reel.animationTime / 2).then(() => {
      this.checking = false;
    });
  };

  /**
   * @private
   * @param {BlockType[]} blocks
   */
  this.highlightBlocks = (blocks) => {
    for (const [reelIndex, { block }] of blocks.entries()) {
      this.reels[reelIndex].highlightBlock(block);
    }
  };
}
