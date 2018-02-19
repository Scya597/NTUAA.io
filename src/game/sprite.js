import { Sprite, Graphics, Texture, Container, Text } from 'pixi.js';
import playerPNG from '../assets/player.png';
/**
 * Convert mass to radius.
 * @function getRadius
 * @param {number} mass - mass
 * @return {number} - radius.
 */
function getRadius(mass) {
  return Math.sqrt(Math.abs(mass) / Math.PI);
}

/**
 * Generate a PIXI.Texture of the circle.
 * @function generateCircleTexture
 * @param {Circle} circle - any object extends from Circle.
 * @return {PIXI.Texture} - A PIXI.Texture to construct a sprite.
 */
function generateCircleTexture(circle, radius) {
  const graphics = new Graphics();
  graphics.lineStyle();
  graphics.beginFill(circle.color);
  graphics.drawCircle(0, 0, radius);
  graphics.endFill();
  return graphics.generateCanvasTexture();
}

/**
 * A class extends from PIXI.Sprite to define
 * convenient methods for easily constructing or updating a cell sprite.
 * @extends PIXI.Sprite */
class CellSprite extends Sprite {
  /**
   * Create a cellSprite from the data in cell.
   * @param {Cell} cell - A cell object
   */
  constructor(cell) {
    super(Texture.fromImage(playerPNG));
    const r = getRadius(cell.mass);
    this.width = 2 * r;
    this.height = 2 * r;
    /**
     * Sprite's uuid
     * @member {string} */
    this.id = cell.id;
    /**
     * A flag to indicate whether this sprite have been
     * updated after receiving the data from server.
     * If not, it means that it does not exist in the server database anymore,
     * it will be removed from the container.
     * @member {boolean}
     * @default false */
    this.flag = false;
    this.anchor.set(0.5, 0.5);
  }
}
class PlayerSprite extends Container {
  constructor(cell, hp = '0') {
    super();
    this.cell = new CellSprite(cell);
    this.text = new Text(hp);
    this.addChild(this.cell);
    this.addChild(this.text);
  }
  update(player, pos) {
    // update pos
    this.x = pos.x;
    this.y = pos.y;

    // update angle
    const { mousePos } = player;
    const delta = { x: mousePos.x - pos.x, y: -(mousePos.y - pos.y) };
    this.cell.rotation = Math.atan2(delta.x, delta.y);
    // update hp
    console.log(this.text.text, player.score);
    this.text.text = player.score;
  }
}
/**
 * A class extends from PIXI.Sprite to define
 * convenient methods for easily constructing or updating a food sprite.
 * @extends PIXI.Sprite */
class FoodSprite extends Sprite {
  /**
   * Create a foodSprite from the data in food.
   * @param {Food} food - A food object
   */
  constructor(food) {
    super(generateCircleTexture(food, getRadius(food.mass)));
    /**
     * Sprite's uuid
     * @member {string} */
    this.id = food.id;
    /**
     * A flag to indicate whether this sprite have been
     * updated after receiving the data from server.
     * If not, it means that it does not exist in the server database anymore,
     * it will be removed from the container.
     * @member {boolean}
     * @default false */
    this.flag = false;
    this.anchor.set(0.5, 0.5);
  }
  updatePos(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }
}


/**
 * A class extends from PIXI.Sprite to define
 * convenient methods for easily constructing or updating a food sprite.
 * @extends PIXI.Sprite */
class ZoneSprite extends Sprite {
  /**
   * Create a foodSprite from the data in food.
   * @param {Food} food - A food object
   */
  constructor(zone) {
    super(generateCircleTexture(zone, zone.radius));
    /**
     * Sprite's uuid
     * @member {string} */
    this.id = zone.id;
    /**
     * A flag to indicate whether this sprite have been
     * updated after receiving the data from server.
     * If not, it means that it does not exist in the server database anymore,
     * it will be removed from the container.
     * @member {boolean}
     * @default false */
    this.flag = false;
    this.anchor.set(0.5, 0.5);
  }
  updatePos(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }
}


export { Sprite, CellSprite, FoodSprite, ZoneSprite, PlayerSprite };
