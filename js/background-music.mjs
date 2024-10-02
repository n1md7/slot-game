import { Sound } from './sound.mjs';

export function BackgroundMusic() {
  /**
   * @private
   * @type {boolean}
   */
  this.played = false;
  /**
   * @public
   * @readonly
   */
  this.mainTrack = new Sound({
    src: './audio/main-track.mp3',
    volume: 0.1,
    loop: true,
    startAt: 0,
  });

  this.playOnce = () => {
    if (this.played) return;
    this.played = true;
    this.mainTrack.play();
  };
}
