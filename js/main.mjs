import {
  AnyBar,
  BARx1,
  BARx2,
  BARx3,
  Cherry,
  CherryOrSeven,
  LineFive,
  LineFour,
  LineOne,
  LineThree,
  LineTwo,
  ModeRandom,
  Seven,
  tableLines,
  tableSymbols,
} from './constants.js';
import { Easing } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { AssetLoader } from './loader.mjs';
import { Slot } from './slot.mjs';
import { Engine } from './engine.mjs';
import { configureGUI } from './gui.mjs';
import { payTable } from './payTable.mjs';
import { createImage } from './utils.mjs';

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
    canvas: config.ui.canvas,
    mode: ModeRandom,
    color: {
      background: '#061a37',
      border: '#FFFFFF',
    },
    reel: {
      rows: 3,
      cols: 4,
      animationTime: 1000,
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

  configureGUI(slot, engine);

  tableBuilder({
    class: 'table table-sm table-bordered table-hover',
    id: 'myFirstTable',
    border: 1,
  })
    .setHeader({
      Symbol: { key: 'symbol', width: 130 },
      'Line 01': { key: LineOne.toString(), width: 100 },
      'Line 02': { key: LineTwo.toString(), width: 100 },
      'Line 03': { key: LineThree.toString(), width: 100 },
      'Line 04': { key: LineFour.toString(), width: 100 },
      'Line 05': { key: LineFive.toString(), width: 100 },
    })
    .setBody(
      tableSymbols.map((symbol) =>
        tableLines.reduce(
          (row, line) => ({
            ...row,
            [line]: `$<b>${payTable[symbol][line]}</b>`,
          }),
          { symbol },
        ),
      ),
    )
    .on('symbol', (tr) => {
      const width = 40;
      const content = tr.dataset.content;
      switch (content) {
        case Cherry:
          tr.innerHTML = createImage({ src: symbols.Cherry.src, content, width });
          break;
        case Seven:
          tr.innerHTML = createImage({ src: symbols.Seven.src, content, width });
          break;
        case CherryOrSeven:
          tr.innerHTML =
            '<div class="d-flex justify-content-center gap-2">' +
            createImage({ src: symbols.Cherry.src, content: Cherry, width }) +
            createImage({ src: symbols.Seven.src, content: Seven, width }) +
            '</div>';
          break;
        case BARx3:
          tr.innerHTML = createImage({ src: symbols['3xBAR'].src, content, width });
          break;
        case BARx2:
          tr.innerHTML = createImage({ src: symbols['2xBAR'].src, content, width });
          break;
        case BARx1:
          tr.innerHTML = createImage({ src: symbols['1xBAR'].src, content, width });
          break;
        case AnyBar:
          tr.innerHTML =
            '<div class="d-flex justify-content-center gap-2">' +
            createImage({ src: symbols['1xBAR'].src, content: BARx1, width }) +
            createImage({ src: symbols['2xBAR'].src, content: BARx2, width }) +
            createImage({ src: symbols['3xBAR'].src, content: BARx3, width }) +
            '</div>';
          break;
      }
    })
    .appendTo(document.querySelector(`#pay-table-modal .modal-body`));
});

assetLoader.start();
