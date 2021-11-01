const Slot = function (canvas) {
  this.canvas = canvas;
  let auto = false;
  let reels = [...range(1, 3)].map((i) => new Reel(canvas, conf.reel.xOffsets[i - 1]));

  let delta = 0;
  let currentSpin = [];

  this.checkout = function () {
    if (confirm('Are you sure? We can keep your money better!')) {
      conf.player.money = 0;
      conf.balance.value = conf.player.money;
      conf.win.classList.remove('blink');
      auto = false;
      alert('Your operation has been made successfully');
    }
  };

  this.setCredits = function () {
    conf.player.money = conf.balance.value;

    return this;
  };

  this.spin = function () {
    conf.win.value = 0;
    conf.sound.spin.play();
    if (conf.player.money - conf.bet.value * 1 < 0) {
      conf.sound.spin.currentTime = 0;
      conf.sound.spin.pause();
      alert('You dont have enough credits!');
      auto = false;

      return;
    }
    conf.player.money -= conf.bet.value * 1;
    conf.balance.value = conf.player.money;
    currentSpin = [];
    reels.forEach((reel) => {
      reel.clicked = true;
      reel.finalAnimation = false;
      reel.finalShapes = reel.setFinalShapes();
      currentSpin.push(reel.finalShapes);
    });
    conf.spinBtn.setAttribute('disabled', 'disabled');
    conf.what.setAttribute('disabled', 'disabled');
    conf.where.setAttribute('disabled', 'disabled');
    conf.bet.setAttribute('disabled', 'disabled');
    conf.balance.setAttribute('disabled', 'disabled');
    conf.mode.setAttribute('disabled', 'disabled');
    conf.checkout.setAttribute('disabled', 'disabled');
    conf.win.classList.remove('blink');
  };

  this.setMode = function () {
    reels.forEach((reel) => {
      reel.mode = conf.mode.value;
      reel.fixedPlace = conf.where.value;
      reel.fixedImg = conf.what.value;
    });
  };

  this.loop = function (now) {
    reels.forEach((reel, i) => {
      this.drawStopPoints();
      //init spin animation
      reel.spinAnimation();
      reel.spin2point();

      if (reel.clicked) {
        reel.clicked = false;
        reel.clickTime = now;
        reel.spinning = true;
      }

      delta = now - reel.clickTime;
      if (delta > conf.reel.animTimes[i] && reel.spinning) {
        reel.finalAnimation = true;
        reel.spinning = false;

        if (i === 2) {
          conf.spinBtn.removeAttribute('disabled');
          conf.what.removeAttribute('disabled');
          conf.where.removeAttribute('disabled');
          conf.bet.removeAttribute('disabled');
          conf.balance.removeAttribute('disabled');
          conf.mode.removeAttribute('disabled');
          conf.checkout.removeAttribute('disabled');
          reel.done(() => {
            //reset sound and stop
            conf.sound.spin.currentTime = 0;
            conf.sound.spin.pause();
            let won = check(currentSpin);
            if (auto) {
              setTimeout(
                function () {
                  conf.spinBtn.click();
                },
                won ? conf.autoModeDelay : 300,
              );
            }
          });
        }
      }
    });
  };

  this.start = function () {
    conf.sound.win.volume = 1.0;
    conf.sound.spin.volume = 0.03;
    reels.forEach((reel) => {
      reel.clicked = true;
      reel.finalAnimation = false;
      reel.finalShapes = reel.setFinalShapes();
    });
    reels.forEach((reel, i) => {
      reel.clicked = false;
      reel.finalAnimation = true;
      reel.spinning = false;
    });
    return this;
  };

  this.drawStopPoints = function () {
    this.canvas.strokeStyle = '#121212';
    [60, 120, 180].forEach((x) => {
      this.canvas.strokeRect(0, x - 2, 5, 0);
      this.canvas.strokeRect(conf.width - 5, x - 2, 5, 0);
    });
  };

  let check = function (reels) {
    if (reels[0][0].stop !== reels[1][0].stop || reels[1][0].stop !== reels[2][0].stop) {
      //no win
      return;
    }

    let sum = {
      top: 0,
      middle: 0,
      bottom: 0,
    };

    //coefficient - custom added.
    let bet = conf.bet.value * 1;

    let highlightPts = [];
    //all reels are aligned in one line
    for (let r = 0; r < reels.length; r++) {
      let reel1 = reels[0][r],
        reel2 = reels[1][r],
        reel3 = reels[2][r];
      let reelsStr = reel1.key + reel2.key + reel3.key;
      //top line
      if (reel1.stop === 0) {
        if (reelsStr.match(/(Cherry){3}/g)) sum.top += bet * 2000;
        else if (reelsStr.match(/(7){3}/g)) sum.top += bet * 150;
        else if (reelsStr.match(/(7|Cherry){3}/g)) sum.top += bet * 75;
        else if (reelsStr.match(/(3xBAR){3}/g)) sum.top += bet * 50;
        else if (reelsStr.match(/(2xBAR){3}/g)) sum.top += bet * 20;
        else if (reelsStr.match(/(BAR){3}/g)) sum.top += bet * 10;
        else if (reelsStr.match(/(BAR|2xBAR|3xBAR){3}/g)) sum.top += bet * 5;
        if (sum.top !== 0) {
          highlightPts.push(0 + conf.reel.height / 2);
        }
      }
      //middle line
      if (reel1.stop === 60) {
        if (reelsStr.match(/(Cherry){3}/g)) sum.middle += bet * 1000;
        else if (reelsStr.match(/(7){3}/g)) sum.middle += bet * 150;
        else if (reelsStr.match(/(7|Cherry){3}/g)) sum.middle += bet * 75;
        else if (reelsStr.match(/(3xBAR){3}/g)) sum.middle += bet * 50;
        else if (reelsStr.match(/(2xBAR){3}/g)) sum.middle += bet * 20;
        else if (reelsStr.match(/(BAR){3}/g)) sum.middle += bet * 10;
        else if (reelsStr.match(/(BAR|2xBAR|3xBAR){3}/g)) sum.middle += bet * 5;
        if (sum.middle !== 0) {
          highlightPts.push(60 + conf.reel.height / 2);
        }
      }
      //bottom line
      if (reel1.stop === 120) {
        if (reelsStr.match(/(Cherry){3}/g)) sum.bottom += bet * 4000;
        else if (reelsStr.match(/(7){3}/g)) sum.bottom += bet * 150;
        else if (reelsStr.match(/(7|Cherry){3}/g)) sum.bottom += bet * 75;
        else if (reelsStr.match(/(3xBAR){3}/g)) sum.bottom += bet * 50;
        else if (reelsStr.match(/(2xBAR){3}/g)) sum.bottom += bet * 20;
        else if (reelsStr.match(/(BAR){3}/g)) sum.bottom += bet * 10;
        else if (reelsStr.match(/(BAR|2xBAR|3xBAR){3}/g)) sum.bottom += bet * 5;
        if (sum.bottom !== 0) {
          highlightPts.push(120 + conf.reel.height / 2);
        }
      }
    }

    //heightlight winner row
    let margin = 10;
    highlightPts.forEach((i) => {
      canvas.beginPath();
      canvas.moveTo(margin, i - 2);
      canvas.lineTo(conf.width - margin, i - 2);
      canvas.strokeStyle = '#FF0000';
      canvas.stroke();
    });

    let totalSum = sum.top + sum.middle + sum.bottom;
    conf.player.money += totalSum;
    conf.balance.value = conf.player.money;
    if (totalSum !== 0) {
      conf.sound.win.play();
      conf.win.classList.add('blink');
      conf.win.value = totalSum;
      console.log(sum);
      return true;
    }
    return false;
  };

  this.autoToggle = function () {
    auto = !auto;
    let mode = auto === true ? 'ON' : 'OFF';
    conf.autoBtn.innerHTML = conf.autoBtn.innerHTML.replace(/ON|OFF/g, mode);

    conf.spinBtn.click();
  };
};
