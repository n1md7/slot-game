import { Reel } from './reel.mjs';
import { createEmptyArray, waitFor } from './utils.mjs';
import { Calculator } from './calculator.mjs';
import { VisualEffects } from './visual-effects.mjs';
import { Player } from './player.mjs';
import { SoundEffects } from './sound-effects.mjs';
import { BackgroundMusic } from './background-music.mjs';

/**
 * import { ReelOptions, ReelSymbols, ColorOptions, BlockOptions, PaddingOptions, Mode, SlotOptions } from './types.mjs';
 */

/**
 * Slot class. It's responsible for the slot game
 * @param {SlotOptions} options - Slot options
 * @constructor
 */
export function Slot(options) {
  options.fixedSymbols ||= [];

  /**
   * @public
   * @readonly
   * @type {SlotOptions}
   */
  this.options = options;

  /**
   * @public
   * @readonly
   * @type {Player}
   */
  this.player = new Player(options.player);

  /**
   * @public
   * @readonly
   * @type {SoundEffects}
   */
  this.soundEffects = new SoundEffects({ animationTime: options.reel.animationTime });

  /**
   * @public
   * @readonly
   * @type {BackgroundMusic}
   */
  this.backgroundMusic = new BackgroundMusic();

  /**
   * @private
   * @type {CanvasRenderingContext2D}
   */
  this.ctx = options.canvas.getContext('2d');

  /**
   * @private
   * @readonly
   * @type {Reel[]}
   */
  this.reels = [];

  /**
   * @private
   * @readonly
   * @type {VisualEffects}
   */
  this.visualEffects = new VisualEffects(this.reels);

  /**
   * @private
   * @readonly
   * @type {Calculator}
   */
  this.calculator = new Calculator(this.reels);

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
   * @private
   * @type {boolean}
   */
  this.autoSpin = false;

  /**
   * @private
   * @readonly
   * @return {number}
   */
  this.getWidth = () =>
    options.block.width * options.reel.cols +
    options.reel.padding.x * 2 +
    options.block.lineWidth * (options.reel.cols - 1);

  /**
   * @private
   * @readonly
   * @return {number}
   */
  this.getHeight = () => options.block.height * options.reel.rows;

  /**
   * @private
   * @description Paint slot background
   * @returns {void}
   * @readonly
   */
  this.paintBackground = () => {
    this.ctx.fillStyle = options.color.background;
    this.ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
  };

  /**
   * @public
   * @readonly
   */
  this.start = () => {
    this.reset();
  };

  /**
   * @public
   * @readonly
   */
  this.spin = () => {
    if (!this.player.hasEnoughCredits()) return;
    if (this.isSpinning || this.checking) return;

    this.soundEffects.spin.play();
    this.player.subtractSpinCost();
    this.reels.forEach((reel) => reel.spin());

    waitFor(options.reel.animationTime)
      .then(this.evaluateWin)
      .then(() => {
        if (this.autoSpin) {
          return waitFor(100).then(() => {
            return options.buttons.spinManual.click();
          });
        }
      });
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

    const winners = this.calculator.calculate();

    if (!winners.length) {
      return waitFor(100).then(() => {
        this.checking = false;
      });
    }

    this.soundEffects.win.play();
    console.group('Current win');
    const totalWin = winners.reduce((acc, { money }) => acc + money, 0);
    for (const winner of winners) {
      // We have a winner, let's highlight the blocks
      this.visualEffects.highlight(winner.blocks);
      console.info(`Winner: ${winner.type}, line: ${winner.rowIndex}, win: $${winner.money}`);
    }

    this.player.addWin(totalWin);

    console.info(`Total win: $${totalWin}`);
    console.groupEnd();

    // Let's keep user from spinning again while we are highlighting the blocks
    // We add a short delay to make the animation more visible and clear that the user won
    // We set delay at least 2 seconds, or the animation time, whichever is greater
    return waitFor(Math.max(options.reel.animationTime, 2000)).then(() => {
      this.checking = false;
    });
  };

  /**
   * @public
   * @readonly
   */
  this.reset = () => {
    this.reels.length = 0; // Clear the reels without creating a new array
    this.paintBackground();

    createEmptyArray(options.reel.cols).forEach((index) => {
      this.reels.push(
        new Reel({
          ctx: this.ctx,
          height: this.getHeight(),
          padding: options.reel.padding,
          animationTime: options.reel.animationTime,
          animationFunction: options.reel.animationFunction,
          rows: options.reel.rows,
          block: options.block,
          mode: options.mode,
          color: options.color,
          symbols: options.symbols,
          fixedSymbols: options.fixedSymbols,
          index,
        }),
      );
    });

    this.reels.forEach((reel) => reel.reset());
    this.updateCanvasSize();
  };

  /**
   * @public
   * @readonly
   */
  this.updateCanvasSize = () => {
    options.canvas.setAttribute('width', this.getWidth().toString());
    options.canvas.setAttribute('height', this.getHeight().toString());
  };

  /**
   * @private
   * @readonly
   */
  this.subscribeSpinButton = () => {
    options.buttons.spinManual.onclick = () => {
      this.spin();
      this.player.onWin(0); // Reset win amount
    };
  };

  /**
   * @private
   * @readonly
   */
  this.subscribeAutoSpinButton = () => {
    options.buttons.spinAuto.onclick = () => {
      this.autoSpin = !this.autoSpin;
      options.buttons.spinAuto.querySelector('b').innerText = `AUTO | ${this.autoSpin ? 'ON' : 'OFF'}`;
      if (this.autoSpin) {
        options.buttons.spinManual.click();
      }
    };
  };

  /**
   * @private
   * @readonly
   */
  this.subscribeMinusBetButton = () => {
    options.buttons.minusBet.onclick = () => this.player.decBet();
  };

  /**
   * @private
   * @readonly
   */
  this.subscribePlusBetButton = () => {
    options.buttons.plusBet.onclick = () => this.player.incBet();
  };

  /**
   * @private
   * @readonly
   */
  this.subscribePlayerEvents = () => {
    this.player.onUpdate = (credits, bet) => {
      options.text.credits.textContent = `$${credits}`;
      options.text.bet.textContent = `$${bet}`;
    };
    this.player.onWin = (amount) => {
      options.text.winAmount.textContent = `$${amount}`;
    };
  };

  /**
   * @private
   * @readonly
   *
   * @description Subscribe to body click event to play background music, when the user clicks anywhere on the page.
   * It is required since the browser blocks autoplaying audio on page load.
   */
  this.subscribeBodyClick = () => {
    document.body.onclick = () => this.backgroundMusic.playOnce();
  };

  /**
   * @public
   * @readonly
   */
  this.subscribeEvents = () => {
    this.subscribeSpinButton();
    this.subscribeAutoSpinButton();
    this.subscribeMinusBetButton();
    this.subscribePlusBetButton();

    this.subscribePlayerEvents();
    this.subscribeBodyClick();

    this.player.initialize();
  };
}
