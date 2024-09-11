/**
 * import { Slot } from './slot.mjs';
 */

/**
 * @description Simple Game Engine
 * @param {Slot} game - Game Slot instance
 * @param {Object} options - Engine options
 * @param {number} options.FPS - Frames per second
 *
 * @constructor
 */
export function Engine(game, options) {
  /**
   * @description Engine options
   * @public
   * @readonly
   * @type {Object}
   */
  this.options = options;

  const ticker = new Ticker(options);

  this.start = () => {
    game.start();
    updateLoop(0);
  };

  function updateLoop(time) {
    if (ticker.needsUpdate(time)) {
      game.update(time);
    }

    requestAnimationFrame(updateLoop);
  }
}

/**
 * @description Ticker
 * @param {Object} options - Engine options
 * @param {number} options.FPS - Frames per second
 * @constructor
 */
function Ticker(options) {
  let lastTickTime = 0;

  this.needsUpdate = (current) => {
    const interval = 1000 / options.FPS; // ~16ms
    const delta = current - lastTickTime;
    if (delta > interval) {
      lastTickTime = current - (delta % interval);

      return true;
    }

    return false;
  };
}
