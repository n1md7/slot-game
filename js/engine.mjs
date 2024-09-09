/**
 * import { Slot } from './slot.mjs';
 */

/**
 * @description Simple Game Engine
 * @param {Slot} game - Game Slot instance
 * @param {Object} options - Engine options
 * @param {number} [options.FPS = 60] - Frames per second
 *
 * @constructor
 */
export function Engine(game, options) {
  const FPS = options.FPS || 60;
  /**
   * @description Frame interval in milliseconds, this is a delay between each frames
   * @type {number}
   * @constant
   */
  const FRAME_INTERVAL = 1000 / FPS; // ~16ms

  const ticker = new Ticker(FRAME_INTERVAL);

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
 * @param {number} interval
 * @constructor
 */
function Ticker(interval) {
  let lastTickTime = 0;

  this.needsUpdate = (current) => {
    const delta = current - lastTickTime;
    if (delta > interval) {
      lastTickTime = current - (delta % interval);

      return true;
    }

    return false;
  };
}
