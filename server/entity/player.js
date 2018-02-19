import uuid from 'uuid/v1';

import Vector2 from '../space/vector2';
import Cell from './cell';

// const TWEEN = require('@tweenjs/tween.js');

/**
 * The Player class
 */
class Player {
  /**
   * @param {object} [props] - the property of Food
   */
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.mousePos = new Vector2(100, 100);
    this.mouseDown = false;
    this.keysDown = {
      32: 0,
      37: 0, 38: 0, 39: 0, 40: 0,
      65: 0, 87: 0, 68: 0, 83: 0
    };
    this.cellList = [new Cell({
      mass: 2000,
      pos: new Vector2(100, 100),
      id: uuid(),
      color: 0x111111,
      vel: new Vector2(0, 0),
      isEaten: false,
    })];
    this.zones = [];
    this.score = 0;
    this.fireFoodCooldown = 24;
    this.remainingFireFoodCooldown = 0;
  }

  /**
   * @return {boolean} - whether player is dead or not
   */
  isDead() {
    return this.cellList.size() === 0;
  }
}

export default Player;
