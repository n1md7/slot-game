/**
 * @typedef {Object} ReelSymbols
 * @property {HTMLImageElement} 1xBAR - 1xBAR symbol source
 * @property {HTMLImageElement} 2xBAR - 2xBAR symbol source
 * @property {HTMLImageElement} 3xBAR - 3xBAR symbol source
 * @property {HTMLImageElement} Cherry - Cherry symbol source
 * @property {HTMLImageElement} Seven - Seven symbol source
 */

/**
 * @typedef {'1xBAR' | '2xBAR' | '3xBAR' | 'Seven' | 'Cherry'} ReelSymbol
 */

/**
 * @typedef {Object} BlockType - Reel block type
 * @property {ReelSymbol} symbol - Symbol to draw
 * @property {Object} coords - Block coordinates
 * @property {number} coords.yOffset - Y offset from the top to position
 * @property {BlockOptions} block - Block options
 */

/**
 * @typedef {Object} BlockOptions - Reel block type
 * @property {number} width - Slot block width
 * @property {number} height - Slot block height
 * @property {number} lineWidth - Slot block line width
 * @property {number} padding - Slot block padding (Both sides)
 * @property {Object} [color] - Slot block color options
 * @property {number} color.r - Red color value
 * @property {number} color.g - Green color value
 * @property {number} color.b - Blue color value
 */

/**
 * @typedef {Object} ColorOptions - Reel block color options
 * @property {string} background - Background color
 * @property {string} border - Border color
 */

/**
 * @typedef {Object} PaddingOptions - Reel padding options
 * @property {number} x - Slot left/right padding
 */

/**
 * @typedef {Object} ReelOptions - Slot reel options
 * @property {number} rows - Slot reels rows
 * @property {number} cols - Slot reels columns
 * @property {number} animationTime - Slot reels animation time in milliseconds
 * @property {Function} animationFunction - Slot reels animation easing function
 * @property {PaddingOptions} padding - Slot padding
 */

/**
 * @typedef {Object} Group - Group of animations
 * @property {Function} add - Add animation to the group
 * @property {Function} start - Start all animations in the group
 * @property {Function} update - Update all animations in the group
 * @property {Function} remove - Remove animation from the group
 * @property {Function} removeAll - Remove all animations from the group
 */

/**
 * @typedef {Object} Tween - Tween animation
 * @property {Function} start - Start tween animation
 * @property {Function} update - Update tween animation
 * @property {Function} remove - Remove tween animation
 * @property {Function} stop - Stop tween animation
 * @property {Function} to - Set tween target
 * @property {Function} from - Set tween start
 * @property {Function} easing - Set tween easing function
 * @property {Function} duration - Set tween duration
 * @property {Function} yoyo - Set tween yoyo
 * @property {Function} delay - Set tween delay
 * @property {Function} onStart - Set tween start callback
 * @property {Function} onUpdate - Set tween update callback
 * @property {Function} onComplete - Set tween complete callback
 */

/**
 * @typedef {Object} Easing - Tween easing functions
 * @property {Object} Easing.Back - Back easing functions
 * @property {Function} Easing.Back.In - Back easing in function
 * @property {Function} Easing.Back.Out - Back easing out function
 * @property {Function} Easing.Back.InOut - Back easing in-out function
 * @property {Object} Easing.Bounce - Bounce easing functions
 * @property {Function} Easing.Bounce.In - Bounce easing in function
 * @property {Function} Easing.Bounce.Out - Bounce easing out function
 * @property {Function} EasingBounce.InOut - Bounce easing in-out function
 * @property {Object} Easing.Circular - Circular easing functions
 * @property {Function} Easing.Circular.In - Circular easing in function
 * @property {Function} Easing.Circular.Out - Circular easing out function
 * @property {Function} Easing.Circular.InOut - Circular easing in-out function
 * @property {Object} Easing.Cubic - Cubic easing functions
 * @property {Function} Easing.Cubic.In - Cubic easing in function
 * @property {Function} Easing.Cubic.Out - Cubic easing out function
 * @property {Function} Easing.Cubic.InOut - Cubic easing in-out function
 * @property {Object} Easing.Elastic - Elastic easing functions
 * @property {Function} Easing.Elastic.In - Elastic easing in function
 * @property {Function} Easing.Elastic.Out - Elastic easing out function
 * @property {Function} Easing.Elastic.InOut - Elastic easing in-out function
 * @property {Object} Easing.Expo - Expo easing functions
 * @property {Function} Easing.Expo.In - Expo easing in function
 * @property {Function} Easing.Expo.Out - Expo easing out function
 * @property {Function} Easing.Expo.InOut - Expo easing in-out function
 * @property {Object} Easing.Linear - Linear easing functions
 * @property {Function} Easing.Linear.None - Linear easing none function
 * @property {Object} Easing.Quad - Quad easing functions
 * @property {Function} Easing.Quad.In - Quad easing in function
 * @property {Function} Easing.Quad.Out - Quad easing out function
 * @property {Function} Easing.Quad.InOut - Quad easing in-out function
 */

/**
 * @typedef {'fixed'|'random'} Mode - Slot mode
 */

/**
 * @typedef {Object} WinnerType - Slot winner combination
 * @property {'AllSame' | 'CherryOrSeven' | 'AnyBar'} type - Winner symbol
 * @property {number} rowIndex - Winner row(visible) index
 * @property {number} money - Winner money
 * @property {BlockType[]} blocks - Winner blocks
 */

/**
 * @typedef {Object} PlayerOptions - Player options
 * @property {number} credits - Player money
 * @property {number} bet - Player bet
 * @property {number} [MAX_BET = 15] - Player max bet
 */

/**
 * @typedef {Object} AudioVolume - Audio volume options
 * @property {number} background - Background audio volume
 * @property {number} win - Win audio volume
 * @property {number} spin - Spin audio volume
 */

/**
 * @typedef {Object} Buttons - Slot buttons
 * @property {HTMLButtonElement} spinManual - Spin button
 * @property {HTMLButtonElement} spinAuto - Auto spin button
 * @property {HTMLButtonElement} minusBet - Decrease bet button
 * @property {HTMLButtonElement} plusBet - Increase bet button
 */

/**
 * @typedef {Object} Text - Slot text elements
 * @property {HTMLSpanElement} credits - Credits text
 * @property {HTMLSpanElement} bet - Bet text
 * @property {HTMLSpanElement} winAmount - Win amount text
 */

/**
 * @typedef {Object} SlotOptions - Slot options
 * @property {HTMLCanvasElement} canvas - Canvas instance
 * @property {PlayerOptions} player - Player options
 * @property {Mode} mode - Slot mode
 * @property {ColorOptions} color - Slot colors
 * @property {BlockOptions} block - Slot block options
 * @property {ReelSymbols} symbols - Slot symbols object
 * @property {ReelSymbol[]} [fixedSymbols=[]] - Slot fixed symbols array, for fixed mode
 * @property {ReelOptions} reel - Slot reels
 * @property {AudioVolume} volume - Slot audio volume
 * @property {Buttons} buttons - Slot buttons
 * @property {Text} text - Slot text elements
 */
