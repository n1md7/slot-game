import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';
import { Easing } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { BARx1, BARx2, BARx3, Cherry, ModeFixed, ModeRandom, Seven } from './constants.js';
import { Slot } from './slot.mjs';

export const gui = new GUI();
const symbols = { Random: '', BARx1: BARx1, BARx2, BARx3, Seven, Cherry };
const functions = {
  Linear: Easing.Linear.None,
  BackIn: Easing.Back.In,
  BackOut: Easing.Back.Out,
  BackInOut: Easing.Back.InOut,
  BounceIn: Easing.Bounce.In,
  BounceOut: Easing.Bounce.Out,
  BounceInOut: Easing.Bounce.InOut,
  CircularIn: Easing.Circular.In,
  CircularOut: Easing.Circular.Out,
  CircularInOut: Easing.Circular.InOut,
  CubicIn: Easing.Cubic.In,
  CubicOut: Easing.Cubic.Out,
  CubicInOut: Easing.Cubic.InOut,
  ElasticIn: Easing.Elastic.In,
  ElasticOut: Easing.Elastic.Out,
  ElasticInOut: Easing.Elastic.InOut,
};

/**
 * @param {Slot} slot
 * @param {Engine} engine
 * @returns {void}
 */
export const configureGUI = (slot, engine) => {
  gui.title('Slot Machine');
  gui.add(slot.options, 'mode', { Random: ModeRandom, Fixed: ModeFixed });
  const fixed = gui.addFolder('Fixed symbols');
  if (slot.options.mode === ModeRandom) fixed.hide();
  gui.add(engine.options, 'FPS', 6, 60, 1);

  const reel = gui.addFolder('Reel configuration', slot.options.reel);
  reel.add(slot.options.reel, 'rows', 1, 5, 1);
  reel.add(slot.options.reel, 'cols', 3, 7, 1);
  const animation = reel.addFolder('Animation');
  animation.add(slot.options.reel, 'animationTime', 200, 5000, 100);
  animation.add(slot.options.reel, 'animationFunction', functions);

  const block = gui.addFolder('Block configuration', slot.options.block);
  block.addColor(slot.options.color, 'background');
  block.addColor(slot.options.color, 'border');
  block.add(slot.options.block, 'width', 16, 256, 8);
  block.add(slot.options.block, 'height', 16, 256, 8);
  block.add(slot.options.block, 'lineWidth', 0, 4, 1);
  block.add(slot.options.block, 'padding', 0, 48, 1);

  const actions = {
    Reset() {
      gui.reset();
      slot.reset();
    },
  };

  gui.add(actions, 'Reset');

  gui.onFinishChange(({ property }) => {
    if (slot.options.mode === ModeFixed) {
      fixed.show();
      if (property === 'mode') addFixedOptions();
      if (property === 'rows') addFixedOptions();
    } else {
      fixed.hide();
    }

    slot.reset();
  });

  function addFixedOptions() {
    for (let i = fixed.children.length; i < slot.options.reel.rows; i++) {
      fixed.add(slot.options.fixedSymbols, i, symbols);
    }
  }
};
