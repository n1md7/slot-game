import { Easing, Group, Tween } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';

const gui = new GUI();
const IgnoreStartSymbolCount = 3;
const assetBaseURL = 'https://n1md7.github.io/slot-game';

const BARx1 = '1xBAR';
const BARx2 = '2xBAR';
const BARx3 = '3xBAR';
const Seven = 'Seven';
const Cherry = 'Cherry';
const AnyBar = 'AnyBar';
const AllSame = 'AllSame';
const CherryOrSeven = 'CherryOrSeven';

const LineOne = 0;
const LineTwo = 1;
const LineThree = 2;
const LineFour = 3;
const LineFive = 4;

const ModeFixed = 'fixed';
const ModeRandom = 'random';

const tableSymbols = [Cherry, Seven, CherryOrSeven, BARx3, BARx2, BARx1, AnyBar];
const tableLines = [LineOne, LineTwo, LineThree, LineFour, LineFive];

const symbols = { Random: '', BARx1, BARx2, BARx3, Seven, Cherry };
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

const config = {
  assets: [],
  symbols: [],
  ui: {
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

const payTable = Object.freeze({
  [BARx1]: {
    [LineOne]: 10,
    [LineTwo]: 10,
    [LineThree]: 20,
    [LineFour]: 30,
    [LineFive]: 40,
  },
  [BARx2]: {
    [LineOne]: 20,
    [LineTwo]: 20,
    [LineThree]: 30,
    [LineFour]: 40,
    [LineFive]: 50,
  },
  [BARx3]: {
    [LineOne]: 30,
    [LineTwo]: 30,
    [LineThree]: 40,
    [LineFour]: 50,
    [LineFive]: 60,
  },
  [Seven]: {
    [LineOne]: 150,
    [LineTwo]: 300,
    [LineThree]: 600,
    [LineFour]: 1200,
    [LineFive]: 2400,
  },
  [Cherry]: {
    [LineOne]: 1000,
    [LineTwo]: 2000,
    [LineThree]: 3000,
    [LineFour]: 4000,
    [LineFive]: 5000,
  },
  [CherryOrSeven]: {
    [LineOne]: 75,
    [LineTwo]: 150,
    [LineThree]: 300,
    [LineFour]: 600,
    [LineFive]: 1200,
  },
  [AnyBar]: {
    [LineOne]: 5,
    [LineTwo]: 5,
    [LineThree]: 10,
    [LineFour]: 15,
    [LineFive]: 20,
  },
});

const assetLoader = new AssetLoader([
  assetBaseURL + '/img/1xBAR.png',
  assetBaseURL + '/img/2xBAR.png',
  assetBaseURL + '/img/3xBAR.png',
  assetBaseURL + '/img/Seven.png',
  assetBaseURL + '/img/Cherry.png',
]);

assetLoader.onLoadFinish((assets) => {
  console.info('All assets loaded', assets);

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
      background: 0.02,
      win: 0.3,
      spin: 0.1,
    },
    canvas: config.ui.canvas,
    buttons: config.ui.btn,
    text: config.ui.text,
    mode: ModeRandom,
    color: {
      background: '#1a1a1a',
      border: '#1f2023',
    },
    reel: {
      rows: 2,
      cols: 3,
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

  const engine = new Engine(slot, { FPS: 60 });

  slot.updateCanvasSize();
  slot.subscribeEvents();

  engine.start();

  configureTweakPane(slot, engine);
  createPayTable(symbols, payTable, config.ui.modalBody);
});

assetLoader.start();

function Engine(game, options) {
  this.options = options;

  const ticker = new Ticker(options);

  this.start = () => {
    game.start();
    updateLoop(0);
  };

  function updateLoop(time) {
    if (ticker.needsUpdate(time)) {
      game.update(time);
    }

    requestAnimationFrame(updateLoop);
  }
}

function Ticker(options) {
  let lastTickTime = 0;

  this.needsUpdate = (current) => {
    const interval = 1000 / options.FPS; // ~16ms
    const delta = current - lastTickTime;
    if (delta > interval) {
      lastTickTime = current - (delta % interval);

      return true;
    }

    return false;
  };
}

function Slot(options) {
  options.fixedSymbols ||= [];

  this.options = options;
  this.player = new Player(options.player);
  this.soundEffects = new SoundEffects({
    animationTime: options.reel.animationTime,
  });
  this.backgroundMusic = new BackgroundMusic();
  this.ctx = options.canvas.getContext('2d');
  this.reels = [];
  this.visualEffects = new VisualEffects(this.reels);
  this.calculator = new Calculator(this.reels);
  this.isSpinning = false;
  this.checking = false;
  this.autoSpin = false;

  this.getWidth = () =>
    options.block.width * options.reel.cols +
    options.reel.padding.x * 2 +
    options.block.lineWidth * (options.reel.cols - 1);

  this.getHeight = () => options.block.height * options.reel.rows;

  this.paintBackground = () => {
    this.ctx.fillStyle = options.color.background;
    this.ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
  };

  this.start = () => {
    this.reset();
  };

  this.spin = () => {
    if (!this.player.hasEnoughCredits()) return;
    if (this.isSpinning || this.checking) return;

    this.soundEffects.spin.play();
    this.player.subtractSpinCost();
    this.reels.forEach((reel) => reel.spin());

    waitFor(options.reel.animationTime)
      .then(this.evaluateWin)
      .then(() => {
        if (this.autoSpin) {
          return waitFor(100).then(() => {
            return options.buttons.spinManual.click();
          });
        }
      });
  };

  this.update = (time) => {
    this.isSpinning = this.reels.some((reel) => reel.isSpinning);

    for (const reel of this.reels) {
      reel.update(time);
    }
  };

  this.evaluateWin = () => {
    this.checking = true;

    const winners = this.calculator.calculate();

    if (!winners.length) {
      return waitFor(100).then(() => {
        this.checking = false;
      });
    }

    this.soundEffects.win.play();
    console.group('Current win');
    const totalWin = winners.reduce((acc, { money }) => acc + money, 0);
    for (const winner of winners) {
      // We have a winner, let's highlight the blocks
      this.visualEffects.highlight(winner.blocks);
      console.info(`Winner: ${winner.type}, line: ${winner.rowIndex}, win: $${winner.money}`);
    }

    this.player.addWin(totalWin);

    console.info(`Total win: $${totalWin}`);
    console.groupEnd();

    // Let's keep user from spinning again while we are highlighting the blocks
    // We add a short delay to make the animation more visible and clear that the user won
    // We set delay at least 2 seconds, or the animation time, whichever is greater
    return waitFor(Math.max(options.reel.animationTime, 2000)).then(() => {
      this.checking = false;
    });
  };

  this.reset = () => {
    this.reels.length = 0; // Clear the reels without creating a new array
    this.paintBackground();

    createEmptyArray(options.reel.cols).forEach((index) => {
      this.reels.push(
        new Reel({
          ctx: this.ctx,
          height: this.getHeight(),
          padding: options.reel.padding,
          animationTime: options.reel.animationTime,
          animationFunction: options.reel.animationFunction,
          rows: options.reel.rows,
          block: options.block,
          mode: options.mode,
          color: options.color,
          symbols: options.symbols,
          fixedSymbols: options.fixedSymbols,
          index,
        }),
      );
    });

    this.reels.forEach((reel) => reel.reset());
    this.updateCanvasSize();
  };

  this.updateCanvasSize = () => {
    options.canvas.setAttribute('width', this.getWidth().toString());
    options.canvas.setAttribute('height', this.getHeight().toString());
  };

  this.subscribeSpinButton = () => {
    options.buttons.spinManual.onclick = () => {
      this.spin();
      this.player.onWin(0); // Reset win amount
    };
  };

  this.subscribeAutoSpinButton = () => {
    options.buttons.spinAuto.onclick = () => {
      this.autoSpin = !this.autoSpin;
      options.buttons.spinAuto.querySelector('b').innerText = `AUTO | ${this.autoSpin ? 'ON' : 'OFF'}`;
      if (this.autoSpin) {
        options.buttons.spinManual.click();
      }
    };
  };

  this.subscribeMinusBetButton = () => {
    options.buttons.minusBet.onclick = () => this.player.decBet();
  };

  this.subscribePlusBetButton = () => {
    options.buttons.plusBet.onclick = () => this.player.incBet();
  };

  this.subscribePlayerEvents = () => {
    this.player.onUpdate = (credits, bet) => {
      options.text.credits.textContent = `$${credits}`;
      options.text.bet.textContent = `$${bet}`;
    };
    this.player.onWin = (amount) => {
      options.text.winAmount.textContent = `$${amount}`;
    };
  };

  this.subscribeBodyClick = () => {
    document.body.onclick = () => this.backgroundMusic.playOnce();
  };

  this.subscribeEvents = () => {
    this.subscribeSpinButton();
    this.subscribeAutoSpinButton();
    this.subscribeMinusBetButton();
    this.subscribePlusBetButton();

    this.subscribePlayerEvents();
    this.subscribeBodyClick();

    this.player.initialize();
  };
}

function BackgroundMusic() {
  this.played = false;
  this.mainTrack = new Sound({
    src: assetBaseURL + '/audio/main-track.mp3',
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

function Calculator(reels) {
  this.checker = new Checker();

  this.getVisibleBlocks = () => {
    const rows = [];
    const start = IgnoreStartSymbolCount;
    const end = IgnoreStartSymbolCount + reels[0].options.rows;
    for (let row = start; row < end; row++) {
      const blocks = [];

      for (const reel of reels) {
        blocks.push(reel.blocks[row]);
      }

      rows.push(blocks);
    }

    return rows;
  };

  this.calculate = () => {
    const winners = [];

    for (const [rowIndex, blocks] of this.getVisibleBlocks().entries()) {
      const allSymbolsMatch = this.checker.allSymbolsMatch(blocks);
      const cherryOrSevenMatch = this.checker.cherryOrSevenCombination(blocks);
      const anyBarMatch = this.checker.anyBarCombination(blocks);

      switch (true) {
        case allSymbolsMatch: {
          const symbol = blocks.at(0).symbol;
          const money = payTable[symbol][rowIndex];

          winners.push({ type: AllSame, rowIndex, blocks, money });
          break;
        }
        case cherryOrSevenMatch: {
          const money = payTable[CherryOrSeven][rowIndex];
          winners.push({ type: CherryOrSeven, rowIndex, blocks, money });
          break;
        }
        case anyBarMatch: {
          const money = payTable[AnyBar][rowIndex];
          winners.push({ type: AnyBar, rowIndex, blocks, money });
          break;
        }
      }
    }

    return winners;
  };
}

function Checker() {
  this.allSymbolsMatch = ([first, ...blocks]) => {
    return blocks.every((block) => block.symbol === first.symbol);
  };

  this.anyBarCombination = (blocks) => {
    return blocks.every((block) => [BARx1, BARx2, BARx3].includes(block.symbol));
  };

  this.cherryOrSevenCombination = (blocks) => {
    return blocks.every((block) => [Cherry, Seven].includes(block.symbol));
  };
}

function Canvas(options) {
  this.xOffset = options.xOffset;

  this.clearBlock = () => {
    options.ctx.clearRect(this.xOffset, 0, options.width, options.height);
  };

  this.draw = ({ block, symbol, coords: { yOffset } }) => {
    if (!options.symbols[symbol]) {
      throw new Error(`Symbol ${symbol} is not defined in the symbols object`);
    }

    const padding = block.padding + block.lineWidth;
    const symbolWidth = block.width - padding * 2;
    const symbolHeight = block.height - padding * 2;

    options.ctx.strokeStyle = options.color.border;
    options.ctx.lineWidth = block.lineWidth;

    if (block.color) {
      const { r, g, b, a } = block.color;
      options.ctx.fillStyle = `#${decToHex(r)}${decToHex(g)}${decToHex(b)}${decToHex(a)}`;
      options.ctx.fillRect(this.xOffset, yOffset, options.width, options.height);
    }

    options.ctx.drawImage(
      options.symbols[symbol],
      this.xOffset + padding,
      yOffset + padding,
      symbolWidth,
      symbolHeight,
    );
    options.ctx.strokeRect(this.xOffset, yOffset, options.width, options.height);
  };
}

const configureTweakPane = (slot, engine) => {
  gui.title('Slot Machine');
  const player = gui.addFolder('Player', slot.player);
  player.add(slot.options.player, 'credits', 0, 1024, 1);
  player.add(slot.options.player, 'bet', 1, slot.options.player.MAX_BET, 1);
  player.onFinishChange(() => {
    slot.player.onUpdate(slot.options.player.credits, slot.options.player.bet);
  });

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
  block.addColor(slot.options.color, 'background').onChange(() => slot.reset());
  block.addColor(slot.options.color, 'border');
  block.add(slot.options.block, 'width', 16, 256, 8);
  block.add(slot.options.block, 'height', 16, 256, 8);
  block.add(slot.options.block, 'lineWidth', 0, 4, 1);
  block.add(slot.options.block, 'padding', 0, 48, 1);

  const volume = gui.addFolder('Audio Volume', slot.options.volume);
  volume.add(slot.options.volume, 'background', 0, 1, 0.01);
  volume.add(slot.options.volume, 'win', 0, 1, 0.01);
  volume.add(slot.options.volume, 'spin', 0, 1, 0.01);
  volume.onFinishChange(({ property }) => {
    if (slot.soundEffects[property]) {
      slot.soundEffects[property].setVolume(slot.options.volume[property]);
    }
    if (property === 'background') {
      slot.backgroundMusic.mainTrack.setVolume(slot.options.volume[property]);
    }
  });

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

function AssetLoader(assets) {
  const IMG_ALLOWED_TYPES = ['png', 'jpg', 'jpeg'];
  const TOTAL_ASSETS = assets.length;

  const callbacks = [];
  const loadedImages = [];

  const getExtensionFrom = (resource) => {
    const split = resource.split('.');
    return split[split.length - 1];
  };

  const getAssetNameFrom = (src) => {
    return src.replace(new RegExp('^(.*/img/)|(.png|.jpg|.jpeg)$', 'ig'), '');
  };

  const getFilteredImages = (resources) => {
    return resources.filter((resource) => {
      const extension = getExtensionFrom(resource);
      return IMG_ALLOWED_TYPES.includes(extension);
    });
  };

  const loadImage = (src) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedImages.push({ img, src, name: getAssetNameFrom(src) });

      if (loadedImages.length === TOTAL_ASSETS) {
        // Execute all callbacks
        callbacks.forEach((fn) => fn(loadedImages));
      }
    };
    img.onerror = () => console.error(`Failed to load image: ${src}`);
  };

  this.onLoadFinish = function (fns) {
    callbacks.push(fns);

    return this;
  };

  this.start = function () {
    const imageURLsToLoad = getFilteredImages(assets);

    imageURLsToLoad.forEach(loadImage);
  };
}

function Modes(reel) {
  this.getRandomSymbol = () => {
    const totalSymbols = reel.symbolKeys.length;
    const randomIndex = Math.floor(Math.random() * totalSymbols);

    return reel.symbolKeys[randomIndex];
  };

  this.genReelSymbols = () => {
    const visibleBlocks = reel.options.rows;
    // Calculated to Y position to start the animation
    const startY = Math.abs((visibleBlocks + IgnoreStartSymbolCount - reel.totalBlocks) * reel.options.block.height);

    const nextSymbols = createEmptyArray(reel.totalBlocks).map((index) => {
      const coords = {
        yOffset: (index - reel.totalBlocks + visibleBlocks) * reel.options.block.height,
      };
      const symbol = this.getRandomSymbol();
      const isFirst = index === 0;

      const animation = new Tween(coords)
        .to(
          {
            yOffset: startY + coords.yOffset,
          },
          reel.options.animationTime,
        )
        .easing(reel.options.animationFunction)
        .start();

      // Just one Tween event to handle the completion, they all will finish at the same time
      if (isFirst) {
        animation.onComplete(() => {
          reel.isSpinning = false;
        });
      }

      reel.animations.add(animation);

      const block = { ...reel.options.block }; // Copy the block options
      block.color = hexToObject(reel.options.color.background, 16);

      return {
        symbol,
        coords,
        block,
      };
    });
    // During the initial animation, there are no previous symbols to replace, so we use the nextSymbols array as a placeholder
    const prevSymbols = reel.blocks.length > 0 ? reel.blocks : nextSymbols;
    const size = prevSymbols.length;
    // Replace the last visible blocks on the nextSymbols array to keep the animation smooth
    for (let i = 0; i < visibleBlocks; i++) {
      nextSymbols[size - visibleBlocks + i].symbol = prevSymbols[i + IgnoreStartSymbolCount].symbol;
    }

    // Update the animation blocks
    reel.blocks = nextSymbols;
  };

  this.getFixedSymbols = () => {
    for (let i = 0; i <= reel.options.rows; i++) {
      reel.blocks[IgnoreStartSymbolCount + i].symbol = reel.options.fixedSymbols[i] || this.getRandomSymbol();
    }
  };

  this.genByMode = (mode) => {
    this.genReelSymbols();
    if (mode === ModeFixed) {
      this.getFixedSymbols();
    }
  };
}

function Player(options) {
  this.options = options;

  this.credits = new Counter(options, 'credits');

  this.bet = new Counter(options, 'bet');

  this.onUpdate = (credits, bet) => {};

  this.onWin = (amount) => {};

  this.addWin = (win) => {
    win *= this.bet.get();
    this.credits.add(win);
    this.onWin(win);
    this.onUpdate(this.credits.get(), this.bet.get());
  };

  this.incBet = () => {
    if (this.bet.get() === this.options.MAX_BET) return;
    this.bet.inc();
    this.onUpdate(this.credits.get(), this.bet.get());
  };

  this.decBet = () => {
    if (this.bet.get() === 1) return;
    this.bet.dec();
    this.onUpdate(this.credits.get(), this.bet.get());
  };

  this.subtractSpinCost = () => {
    this.credits.sub(this.bet.get());
    this.onUpdate(this.credits.get(), this.bet.get());
  };

  this.hasEnoughCredits = () => this.credits.get() >= this.bet.get();

  this.initialize = () => {
    this.credits.set(options.credits);
    this.bet.set(options.bet);
    this.onWin(0);
    this.onUpdate(this.credits.get(), this.bet.get());
  };
}

function Counter(object, property) {
  this.inc = () => object[property]++;
  this.dec = () => object[property]--;
  this.set = (val) => (object[property] = val);
  this.add = (val) => (object[property] += val);
  this.sub = (val) => (object[property] -= val);
  this.get = () => object[property];
}

function Reel(options) {
  this.options = options;
  this.mode = new Modes(this);
  this.canvas = new Canvas({
    ctx: options.ctx,
    width: options.block.width,
    color: options.color,
    height: options.height,
    xOffset: options.index * options.block.width + options.padding.x + options.index * options.block.lineWidth,
    symbols: options.symbols,
  });
  this.animations = new Group();
  this.symbolKeys = Object.keys(options.symbols);
  this.totalBlocks = 2 * options.rows + options.index + IgnoreStartSymbolCount;
  this.blocks = [];
  this.isSpinning = false;

  this.drawBlocks = () => {
    for (const block of this.blocks) {
      this.canvas.draw(block);
    }
  };

  this.reset = () => {
    this.animations.removeAll();
    this.mode.genByMode(options.mode);
    this.drawBlocks();
    this.isSpinning = false;
  };

  this.update = (time) => {
    this.canvas.clearBlock();
    this.animations.update(time);
    this.drawBlocks();
  };

  this.spin = () => {
    this.reset();
    this.isSpinning = true;
  };
}

function Sound(options) {
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

function SoundEffects(options) {
  this.spin = new Sound({
    src: assetBaseURL + '/audio/spin.wav',
    volume: 0.2,
    startAt: 0,
    endAt: options.animationTime / 1000,
  });

  this.win = new Sound({
    src: assetBaseURL + '/audio/win.wav',
    volume: 0.5,
    startAt: 0,
    endAt: 3,
  });
}

function createEmptyArray(length) {
  return Array.from({ length }).map((_, i) => i);
}

function hexToObject(hexValue, radix = 10) {
  if (!hexValue.startsWith('#')) {
    throw new Error('Invalid hex value: ' + hexValue);
  }

  return {
    r: parseInt(hexValue.slice(1, 3), radix),
    g: parseInt(hexValue.slice(3, 5), radix),
    b: parseInt(hexValue.slice(5, 7), radix),
    a: parseInt(hexValue.slice(7, 9), radix) || 255,
  };
}

function decToHex(value) {
  return Math.floor(value).toString(16).padStart(2, '0');
}

const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitForSec = (sec) => new Promise((resolve) => setTimeout(resolve, sec * 1000));

const createImage = ({ src, width, content }) => {
  return `<img src="${src}" alt="${content}" width="${width}" class="img-thumbnail rounded" />`;
};

const createPayTable = (symbols, payTable, parent) => {
  tableBuilder({
    class: 'table table-sm table-bordered table-hover',
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
          tr.innerHTML = createImage({
            src: symbols.Cherry.src,
            content,
            width,
          });
          break;
        case Seven:
          tr.innerHTML = createImage({
            src: symbols.Seven.src,
            content,
            width,
          });
          break;
        case CherryOrSeven:
          tr.innerHTML =
            '<div class="d-flex justify-content-center gap-2">' +
            createImage({ src: symbols.Cherry.src, content: Cherry, width }) +
            createImage({ src: symbols.Seven.src, content: Seven, width }) +
            '</div>';
          break;
        case BARx3:
          tr.innerHTML = createImage({
            src: symbols['3xBAR'].src,
            content,
            width,
          });
          break;
        case BARx2:
          tr.innerHTML = createImage({
            src: symbols['2xBAR'].src,
            content,
            width,
          });
          break;
        case BARx1:
          tr.innerHTML = createImage({
            src: symbols['1xBAR'].src,
            content,
            width,
          });
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
    .appendTo(parent);
};

function VisualEffects(reels) {
  this.highlightBlock = (block, reelIndex) => {
    block.color = {
      r: 0,
      g: 0,
      b: 0,
      a: 255,
    };

    reels[reelIndex].animations.add(
      new Tween(block.color)
        .to(
          {
            r: 255,
            g: 255,
            b: 255,
          },
          300,
        )
        .easing(Easing.Cubic.InOut)
        .repeat(Infinity)
        .start(),
    );
  };

  this.highlight = (blocks) => {
    for (const [reelIndex, { block }] of blocks.entries()) {
      this.highlightBlock(block, reelIndex);
    }
  };
}
