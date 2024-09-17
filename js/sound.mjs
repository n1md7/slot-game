import { waitForSec } from './utils.mjs';

/**
 * Sound class
 * @param {Object} options
 * @param {string} options.src - Sound source
 * @param {number} [options.startAt] - Sound start at
 * @param {number} [options.endAt] - Sound end at
 * @param {number} [options.volume = 1] - Sound volume
 * @param {boolean} [options.loop = false] - Sound loop
 * @param {boolean} [options.autoplay = false] - Sound autoplay
 * @param {boolean} [options.muted = false] - Sound muted
 * @constructor
 */
export function Sound(options) {
  options.volume ||= 1;
  options.startAt ||= 0;
  options.endAt ||= 0;
  options.loop ||= false;
  options.autoplay ||= false;
  options.muted ||= false;

  this.options = options;
  this.audio = new Audio(options.src);
  this.audio.preload = 'auto';
  this.audio.currentTime = options.startAt;
  this.audio.volume = options.volume;
  this.audio.loop = options.loop;
  this.audio.autoplay = options.autoplay;
  this.audio.muted = options.muted;
  this.play = () => {
    this.audio
      .play()
      .then(() => {
        if (options.endAt) waitForSec(options.endAt - options.startAt).then(() => this.stop());
      })
      .catch(console.error);

    return () => this.stop();
  };
  this.stop = () => {
    this.audio.pause();
    this.audio.currentTime = options.startAt;
  };
  this.mute = () => (this.audio.muted = true);
  this.unmute = () => (this.audio.muted = false);
  this.toggle = () => (this.audio.muted = !this.audio.muted);
  this.setVolume = (volume) => (this.audio.volume = volume);
}
