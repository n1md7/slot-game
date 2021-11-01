const Reel = function (canvas, offsetX = 0) {
  //generate img objects for a reel
  this.reelMap = conf.imgMap.shuffle().map((text, index) => ({
    offsetY: conf.reel.height * conf.imgStartPts[index],
    key: text,
  }));
  this.fnc = null;
  this.spinning = false;
  this.finalAnimation = false;
  this.clickTime = 0;
  this.showedLastAnim = false;
  this.clicked = false;
  this.mode = 'random';
  this.fixedPlace = 'top';
  this.fixedImg = 'BAR';
  this.finalShapes = [];
  //clear whole reel
  const clear = function () {
    canvas.clearRect(offsetX, conf.height, conf.reel.width, conf.height);
  };

  //draw image to specific point
  const draw = function (key = 'BAR', offsetY = 0, blur = 0) {
    if (conf.img.hasOwnProperty(key)) {
      clear();

      canvas.strokeStyle = '#000';
      canvas.filter = `blur(${blur}px)`;
      canvas.lineWidth = 4;
      canvas.fillRect(offsetX, offsetY, conf.reel.width, conf.reel.height);
      canvas.strokeRect(offsetX, offsetY, conf.reel.width, conf.reel.height);
      canvas.drawImage(conf.img[key], offsetX, offsetY);
      canvas.filter = 'none';
    }
  };

  this.spinAnimation = function (skip) {
    if (!this.spinning) return;

    this.reelMap.forEach((img) => {
      img.offsetY += conf.pSkip;

      //reset prev and jump very top
      if (img.offsetY >= conf.height) {
        img.offsetY = conf.reel.height * -3;
      }

      //draw img object
      draw(img.key, img.offsetY, 4);
    });
  };

  this.generateReelShapesFixed = function () {
    let imgMp = conf.imgMap.filter((x) => x !== this.fixedImg);
    let rndImg2 = imgMp.rnd();
    imgMp.splice(imgMp.indexOf(rndImg2), 1);
    let rndImg3 = imgMp.rnd();
    switch (this.fixedPlace) {
      case 'top':
        return [
          {
            offsetY: -60,
            key: this.fixedImg,
            stop: 0,
          },
          {
            offsetY: 60,
            key: rndImg2,
            stop: 120,
          },
          {
            offsetY: 180,
            key: rndImg3,
            stop: 240,
          },
        ];
      case 'middle':
        return [
          {
            offsetY: -120,
            key: rndImg2,
            stop: -60,
          },
          {
            offsetY: 0,
            key: this.fixedImg,
            stop: 60,
          },
          {
            offsetY: 120,
            key: rndImg3,
            stop: 180,
          },
        ];
      default:
        return [
          {
            offsetY: -180,
            key: rndImg2,
            stop: -120,
          },
          {
            offsetY: -60,
            key: rndImg3,
            stop: 0,
          },
          {
            offsetY: 60,
            key: this.fixedImg,
            stop: 120,
          },
        ];
    }
  };

  this.generateReelShapesRandom = function () {
    let imgMp = conf.imgMap.map((x) => x);
    let rndImg1 = imgMp.rnd();
    imgMp.splice(imgMp.indexOf(rndImg1), 1);
    let rndImg2 = imgMp.rnd();
    imgMp.splice(imgMp.indexOf(rndImg2), 1);
    let rndImg3 = imgMp.rnd();

    let rnd = [0, 60].rnd();
    return [
      {
        offsetY: -120 + rnd,
        key: rndImg1,
        stop: -60 + rnd,
      },
      {
        offsetY: 0 + rnd,
        key: rndImg2,
        stop: 60 + rnd,
      },
      {
        offsetY: 120 + rnd,
        key: rndImg3,
        stop: 180 + rnd,
      },
    ];
  };

  this.setFinalShapes = function () {
    switch (this.mode) {
      case 'fixed':
        return this.generateReelShapesFixed();
        break;
      default:
        return this.generateReelShapesRandom();
    }
  };

  this.spin2point = function () {
    if (!this.finalAnimation) {
      if (typeof this.fnc === 'function') {
        this.fnc();
        this.fnc = null;
      }

      return;
    }

    let stopPt;
    this.finalShapes.forEach((img) => {
      if (img.hasOwnProperty('stop')) {
        stopPt = img.stop;
      }
      let inx = 6;
      if (img.offsetY + inx === stopPt) {
        this.finalAnimation = false;
      }
      img.offsetY += inx;

      //draw img object
      draw(img.key, img.offsetY);
    });
  };

  this.done = function (fn) {
    this.fnc = fn;
  };
};
