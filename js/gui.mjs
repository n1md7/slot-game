import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';
import { ModeFixed, ModeRandom } from './constants.js';
import { Slot } from './slot.mjs';

export const gui = new GUI();

/**
 * @param {Slot} slot
 * @param {Engine} engine
 * @returns {void}
 */
export const configureGUI = (slot, engine) => {
  const actions = {
    Reset() {
      gui.reset();
      slot.reset();
    },
  };

  gui.title('Slot Machine');
  gui.add(slot.options, 'mode', { Random: ModeRandom, Fixed: ModeFixed });
  gui.add(engine.options, 'FPS', 6, 60, 1);

  const reel = gui.addFolder('Reel configuration', slot.options.reel);
  reel.add(slot.options.reel, 'rows', 1, 5, 1);
  reel.add(slot.options.reel, 'cols', 3, 7, 1);
  reel.add(slot.options.reel, 'animationTime', 200, 5000, 100);

  const block = gui.addFolder('Block configuration', slot.options.block);
  block.addColor(slot.options.color, 'background');
  block.addColor(slot.options.color, 'border');
  block.add(slot.options.block, 'width', 16, 256, 8);
  block.add(slot.options.block, 'height', 16, 256, 8);
  block.add(slot.options.block, 'lineWidth', 0, 4, 1);
  block.add(slot.options.block, 'padding', 0, 48, 1);

  gui.add(actions, 'Reset');

  gui.onFinishChange(() => {
    slot.reset();
  });
};
