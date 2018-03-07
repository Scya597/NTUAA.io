// player no center
import uuid from 'uuid/v1';

import Vector2 from '../space/vector2';
import Cell from './cell';
import { setting } from '../../gameConfig';

const newPos = () => {
  const lA = (setting.worldWidth - (setting.zoneOneRadius * 2) - 264) / 2;
  const lB = (setting.worldHeight - (setting.zoneOneRadius * 2) - 160) / 2;
  const x = Math.random() * setting.worldWidth;
  let y = Math.random() * setting.worldHeight;
  if (x > lA && x < (setting.worldWidth - lA)) {
    if (Math.random() >= 0.5) {
      y = Math.random() * lB;
    } else {
      y = (Math.random() * lB) + (setting.worldHeight - lB);
    }
  }
  return new Vector2(x, y);
};

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
    this.character = props.character;
    this.mousePos = new Vector2(100, 100);
    this.mouseDown = false;
    this.keysDown = {
      32: 0,
      37: 0,
      38: 0,
      39: 0,
      40: 0,
      65: 0,
      87: 0,
      68: 0,
      83: 0,
    };
    this.cellList = [new Cell({
      mass: setting.cellMass,
      pos: newPos(),
      id: uuid(),
      color: 0x414141,
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
