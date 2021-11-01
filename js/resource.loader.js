const Resources = (function (loader, global) {
  if (global.document) {
    return (...resources) => new loader(resources);
  }
})(function (resources) {
  const IMG_ALLOWED_TYPES = ['png', 'jpg', 'jpeg'];
  const loadCallbacks = [],
    $resources = [],
    $imgs = [];

  //extension black listing
  resources.forEach((resource) => {
    const split = resource.split('.'),
      extension = split[split.length - 1];

    if (IMG_ALLOWED_TYPES.includes(extension)) {
      $resources.push(resource);
    }
  });

  this.onLoad = function (fns) {
    if (typeof fns === 'function') {
      loadCallbacks.push(fns);
    }

    return this;
  };

  (function loadImage(index = 0) {
    if (undefined === $resources[index]) {
      //exec callbacks
      loadCallbacks.forEach((f) => f.call(this, $imgs, $resources));

      return;
    }
    let img = new Image();
    img.src = $resources[index];
    img.addEventListener('load', function () {
      $imgs.push(img);
      loadImage(++index);
    });
  })(0);
}, this);
