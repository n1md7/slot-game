import { BARx1, BARx2, BARx3, Cherry, ModeRandom, Seven } from './constants.js';
import { Easing } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { AssetLoader } from './loader.mjs';
import { Slot } from './slot.mjs';
import { Engine } from './engine.mjs';
import { configureTweakPane } from './gui.mjs';
import { payTable } from './payTable.mjs';
import { createPayTable } from './utils.mjs';

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
      spinManual: document.querySelector('#spin-manual'),
      spinAuto: document.querySelector('#spin-auto'),
      minusBet: document.querySelector('#minus-bet'),
      plusBet: document.querySelector('#plus-bet'),
    },
    text: {
      credits: document.querySelector('#credits'),
      bet: document.querySelector('#bet'),
      winAmount: document.querySelector('#win-amount'),
    },
    modalBody: document.querySelector(`#pay-table-modal .modal-body`),
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
    player: {
      credits: 64,
      bet: 1,
      MAX_BET: 15,
    },
    volume: {
      background: 0.04,
      win: 0.3,
      spin: 0.1,
    },
    canvas: config.ui.canvas,
    mode: ModeRandom,
    color: {
      background: '#061a37',
      border: '#FFFFFF',
    },
    reel: {
      rows: 3,
      cols: 4,
      animationTime: 1500,
      animationFunction: Easing.Back.Out,
      padding: {
        x: 1,
      },
    },
    block: {
      width: 141,
      height: 121,
      lineWidth: 0,
      padding: 16,
    },
    symbols,
  });

  const addHighlightWinAmount = () => {
    config.ui.text.winAmount.parentElement.classList.add('highlight');
  };
  const removeHighlightWinAmount = () => {
    config.ui.text.winAmount.parentElement.classList.remove('highlight');
  };

  slot.updateCanvasSize();

  const engine = new Engine(slot, { FPS: 60 });

  // Bind events
  config.ui.btn.spinManual.onclick = () => {
    slot.spin();
    removeHighlightWinAmount();
    slot.player.onWin(0); // Reset win amount
  };
  // config.ui.btn.spinAuto.onclick = () => engine.toggleAutoSpin();
  config.ui.btn.minusBet.onclick = () => slot.player.decBet();
  config.ui.btn.plusBet.onclick = () => slot.player.incBet();
  document.body.onclick = () => slot.backgroundMusic.playOnce();

  slot.player.onUpdate = (credits, bet) => {
    config.ui.text.credits.textContent = `$${credits}`;
    config.ui.text.bet.textContent = `$${bet}`;
  };
  slot.player.onWin = (amount) => {
    if (amount > 0) addHighlightWinAmount(amount);
    config.ui.text.winAmount.textContent = `$${amount}`;
  };
  slot.player.initialize();

  engine.start();

  configureTweakPane(slot, engine);
  createPayTable(symbols, payTable, config.ui.modalBody);
});

assetLoader.start();
