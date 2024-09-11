import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';
import { ModeFixed, ModeRandom } from './constants.js';
import { Slot } from './slot.mjs';

export const gui = new GUI();

/**
 * @param {Slot} slot
 * @returns {void}
 */
export const configureGUI = (slot) => {
  const actions = {
    Reset() {
      gui.reset();
      slot.reset();
    },
  };

  gui.title('Slot Machine');
  gui.add(slot.options, 'mode', { Random: ModeRandom, Fixed: ModeFixed });

  const block = gui.addFolder('Block configuration', slot.options.block);
  block.addColor(slot.options.color, 'background');
  block.addColor(slot.options.color, 'border');
  block.add(slot.options.block, 'width', 16, 256, 8);
  block.add(slot.options.block, 'height', 16, 256, 8);
  block.add(slot.options.block, 'lineWidth', 0, 4, 1);
  block.add(slot.options.block, 'padding', 0, 10, 1);

  const reel = gui.addFolder('Reel configuration', slot.options.reel);
  reel.add(slot.options.reel, 'animationTime', 200, 5000, 100);
  reel.add(slot.options.reel, 'rows', 1, 5, 1);
  reel.add(slot.options.reel, 'cols', 1, 7, 1);

  const reelPadding = reel.addFolder('Padding', slot.options.reel.padding);
  reelPadding.add(slot.options.reel.padding, 'x', 0, 64, 1);

  gui.add(actions, 'Reset');

  gui.onFinishChange((change) => {
    slot.reset();
  });
};
