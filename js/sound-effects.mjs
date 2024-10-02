import { Sound } from './sound.mjs';

/**
 * @description Sound effects class
 * @param {Object} options
 * @param {number} options.animationTime - Animation time
 * @constructor
 */
export function SoundEffects(options) {
  /**
   * @public
   * @readonly
   * @type {Sound}
   */
  this.spin = new Sound({
    src: './audio/spin.wav',
    volume: 0.2,
    startAt: 0,
    endAt: options.animationTime / 1000,
  });

  /**
   * @public
   * @readonly
   * @type {Sound}
   */
  this.win = new Sound({
    src: './audio/win.wav',
    volume: 0.5,
    startAt: 0,
    endAt: 3,
  });
}
