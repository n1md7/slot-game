/**
 * import { PlayerOptions } from './types.mjs';
 */

/**
 * Player class to represent a player in the game.
 * @param {PlayerOptions} options
 * @constructor
 */
export function Player(options) {
  /**
   * @private
   * @readonly
   */
  this.options = options;

  /**
   * @private
   * @type {Counter}
   */
  this.credits = new Counter(options, 'credits');

  /**
   * @private
   * @type {Counter}
   */
  this.bet = new Counter(options, 'bet');

  /**
   * @public
   * @param {number} credits
   * @param {number} bet
   */
  this.onUpdate = (credits, bet) => {};

  /**
   * @public
   * @param {number} amount
   */
  this.onWin = (amount) => {};

  /**
   * @public
   * @readonly
   */
  this.addWin = (win) => {
    win *= this.bet.get();
    this.credits.add(win);
    this.onWin(win);
    this.onUpdate(this.credits.get(), this.bet.get());
  };

  /**
   * @public
   * @readonly
   */
  this.incBet = () => {
    if (this.bet.get() === this.options.MAX_BET) return;
    this.bet.inc();
    this.onUpdate(this.credits.get(), this.bet.get());
  };

  /**
   * @public
   * @readonly
   */
  this.decBet = () => {
    if (this.bet.get() === 1) return;
    this.bet.dec();
    this.onUpdate(this.credits.get(), this.bet.get());
  };

  /**
   * @public
   * @readonly
   */
  this.subtractSpinCost = () => {
    this.credits.sub(this.bet.get());
    this.onUpdate(this.credits.get(), this.bet.get());
  };

  /**
   * @public
   * @readonly
   */
  this.hasEnoughCredits = () => this.credits.get() >= this.bet.get();

  /**
   * @public
   * @readonly
   */
  this.initialize = () => {
    this.credits.set(options.credits);
    this.bet.set(options.bet);
    this.onWin(0);
    this.onUpdate(this.credits.get(), this.bet.get());
  };
}

/**
 * Counter class to represent a counter for a property in an object.
 * To make sure we do not copy the primitive but reference it.
 * Our goal is simply to mutate the object's property. So the GUI can reflect the changes.
 *
 * @param {Object} object
 * @param {string} property
 * @constructor
 */
function Counter(object, property) {
  this.inc = () => object[property]++;
  this.dec = () => object[property]--;
  this.set = (val) => (object[property] = val);
  this.add = (val) => (object[property] += val);
  this.sub = (val) => (object[property] -= val);
  this.get = () => object[property];
}
