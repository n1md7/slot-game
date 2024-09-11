import { AssetLoader } from './loader.mjs';
import { Slot } from './slot.mjs';
import { Engine } from './engine.mjs';
import { createOption } from './utils.mjs';
import { BARx1, BARx2, BARx3, Cherry, ModeRandom, Seven } from './constants.js';
import { configureGUI } from './gui.mjs';

/**
 * @import {ReelSymbols} from './reel.mjs';
 */

const config = {
  assets: [],
  symbols: [],
  ui: {
    /**
     * @type {HTMLCanvasElement}
     */
    canvas: document.querySelector('#slot'),
    btn: {
      spin: document.querySelector('#spin'),
      auto: document.querySelector('#auto'),
      checkout: document.querySelector('#checkout'),
    },
    select: {
      mode: document.querySelector('#mode'),
      line: document.querySelector('#where'),
      symbol: document.querySelector('#what'),
    },
    balance: document.querySelector('#balance'),
    bet: document.querySelector('#bet'),
    win: document.querySelector('#cwin'),
  },
};

const assetLoader = new AssetLoader([
  './img/1xBAR.png',
  './img/2xBAR.png',
  './img/3xBAR.png',
  './img/Seven.png',
  './img/Cherry.png',
]);

assetLoader.onLoadFinish((assets) => {
  console.info('All assets loaded', assets);

  assets.forEach(({ name }) => {
    createOption(name, config.ui.select.symbol);
  });

  /**
   * @type {ReelSymbols}
   */
  const symbols = {
    [BARx1]: assets.find(({ name }) => name === BARx1).img,
    [BARx2]: assets.find(({ name }) => name === BARx2).img,
    [BARx3]: assets.find(({ name }) => name === BARx3).img,
    [Seven]: assets.find(({ name }) => name === Seven).img,
    [Cherry]: assets.find(({ name }) => name === Cherry).img,
  };

  const slot = new Slot({
    canvas: config.ui.canvas,
    mode: ModeRandom,
    color: {
      background: '#313030',
      border: '#2b2b2b',
    },
    reel: {
      rows: 2,
      cols: 3,
      animationTime: 1000,
      padding: {
        x: 1,
      },
    },
    block: {
      width: 141,
      height: 121,
      lineWidth: 0,
      padding: 4,
    },
    symbols,
  });

  slot.updateCanvasSize();

  const engine = new Engine(slot, { FPS: 60 });

  // Bind events
  config.ui.btn.spin.onclick = () => slot.spin();

  engine.start();

  configureGUI(slot);
});

assetLoader.start();
