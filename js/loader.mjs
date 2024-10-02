/**
 * @typedef {Object} CallbackParams - Callback parameters
 * @property {HTMLImageElement} img - Image element
 * @property {string} src - Image source
 * @property {string} name - Image name
 */

/**
 * @typedef {function(CallbackParams[])} OnLoadFinishCallback - OnLoadFinish callback
 */

/**
 * @description Image asset loader, responsible for loading image assets before rendering
 * @param {string[]} assets - Image assets
 * @constructor
 */
export function AssetLoader(assets) {
  const IMG_ALLOWED_TYPES = ['png', 'jpg', 'jpeg'];
  const TOTAL_ASSETS = assets.length;

  /**
   * @description OnLoadFinished callback collection to be executed after all images are loaded
   * @type {OnLoadFinishCallback[]}
   */
  const callbacks = [];

  /**
   * @description Loaded images
   * @type {CallbackParams[]} - Image assets URLs
   */
  const loadedImages = [];

  /**
   * @description Get file extension from resource. e.g. 'png', 'jpg', 'jpeg'
   * @param {string} resource
   * @returns {"png"|"jpg"|"jpeg"}
   */
  const getExtensionFrom = (resource) => {
    const split = resource.split('.');
    return split[split.length - 1];
  };

  /**
   * @description Get asset name from asset URL
   * @param {string} src
   * @returns {string}
   */
  const getAssetNameFrom = (src) => {
    return src.replace(new RegExp('^(.*/img/)|(.png|.jpg|.jpeg)$', 'ig'), '');
  };

  /**
   * @description Filter image assets from resources
   * @param {string[]} resources
   * @returns {*}
   */
  const getFilteredImages = (resources) => {
    return resources.filter((resource) => {
      const extension = getExtensionFrom(resource);
      return IMG_ALLOWED_TYPES.includes(extension);
    });
  };

  /**
   * @description Load single image asset
   * @param {string} src - Image asset URL
   * @returns {void}
   */
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

  /**
   * @description Register a callback to be executed after all images are loaded
   * @param {OnLoadFinishCallback} fns
   * @returns {AssetLoader}
   */
  this.onLoadFinish = function (fns) {
    callbacks.push(fns);

    return this;
  };

  /**
   * @description Start loading image assets
   * @returns {void}
   */
  this.start = function () {
    const imageURLsToLoad = getFilteredImages(assets);

    imageURLsToLoad.forEach(loadImage);
  };
}
