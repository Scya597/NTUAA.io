import Vector2 from '../space/vector2';
import uuid from 'uuid/v1';
import Cell from './cell';

const TWEEN = require('@tweenjs/tween.js');

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
    this.cellList = [new Cell({
      mass: 2000,
      pos: new Vector2(100, 100),
      id: uuid(),
      color: 0x111111,
      vel: new Vector2(0, 0),
      isEaten: false,
    })];
    this.score = 0;
  }

  /**
   * @return {boolean} - whether player is dead or not
   */
  isDead() {
    return this.cellList.size() === 0;
  }
}

export default Player;
