import { AssetLoader } from './loader.mjs';
import { Slot } from './slot.mjs';
import { Engine } from './engine.mjs';
import { createOption } from './utils.mjs';

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
    '1xBAR': assets.find(({ name }) => name === '1xBAR').img,
    '2xBAR': assets.find(({ name }) => name === '2xBAR').img,
    '3xBAR': assets.find(({ name }) => name === '3xBAR').img,
    Seven: assets.find(({ name }) => name === 'Seven').img,
    Cherry: assets.find(({ name }) => name === 'Cherry').img,
  };

  const slot = new Slot({
    canvas: config.ui.canvas,
    mode: 'random',
    color: {
      background: '#292424',
      border: '#293434',
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
      lineWidth: 1,
      padding: 4,
    },
    symbols,
  });
  config.ui.canvas.setAttribute('width', slot.width.toString());
  config.ui.canvas.setAttribute('height', slot.height.toString());
  const engine = new Engine(slot, { FPS: 60 });

  config.ui.btn.spin.onclick = () => slot.spin();

  engine.start();
});

assetLoader.start();
