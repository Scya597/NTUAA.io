import { Sprite, Graphics, Texture, Container, Text, Point } from 'pixi.js';
import playerPNG1 from '../assets/player1.png';
import playerPNG2 from '../assets/player2.png';
import playerPNG3 from '../assets/player3.png';
import playerPNG4 from '../assets/player4.png';
import playerPNG5 from '../assets/player5.png';
import playerPNG6 from '../assets/player6.png';
import playerPNG7 from '../assets/player7.png';
import playerPNG8 from '../assets/player8.png';
import logo from '../assets/logo.png';

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
function generateCircleTexture(circle, radius, alpha = 1) {
  const graphics = new Graphics();
  graphics.lineStyle();
  graphics.beginFill(circle.color);
  graphics.alpha = alpha;
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
  constructor(cell, character) {
    if (character === '1') {
      super(Texture.fromImage(playerPNG1, true, { resolution: 200, antialias: true }));
    } else if (character === '2') {
      super(Texture.fromImage(playerPNG2, true, { resolution: 200, antialias: true }));
    } else if (character === '3') {
      super(Texture.fromImage(playerPNG3, true, { resolution: 200, antialias: true }));
    } else if (character === '4') {
      super(Texture.fromImage(playerPNG4, true, { resolution: 200, antialias: true }));
    } else if (character === '5') {
      super(Texture.fromImage(playerPNG5, true, { resolution: 200, antialias: true }));
    } else if (character === '6') {
      super(Texture.fromImage(playerPNG6, true, { resolution: 200, antialias: true }));
    } else if (character === '7') {
      super(Texture.fromImage(playerPNG7, true, { resolution: 200, antialias: true }));
    } else {
      super(Texture.fromImage(playerPNG8, true, { resolution: 200, antialias: true }));
    }

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
  constructor(cell, name, character, hp = '0') {
    super();
    this.name = name;
    this.cell = new CellSprite(cell, character);
    this.nameText = new Text(`${this.name}: ${hp}`, { fontFamily: 'Arial', fontSize: 15, align: 'center' });
    this.nameText.position = new Point(0, 70);
    this.addChild(this.cell);
    this.addChild(this.nameText);
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
    this.nameText.text = `${this.name}: ${player.score}`;
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
 * convenient methods for easily constructing or updating a logo sprite.
 * @extends PIXI.Sprite */
class LogoSprite extends Sprite {
  /**
   * Create a cellSprite from the data in cell.
   * @param {Cell} cell - A cell object
   */
  constructor(w, h, img) {
    super(Texture.fromImage(img, true, { resolution: 200, antialias: true }));
    this.width = w;
    this.height = h;
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
    super(generateCircleTexture(zone, zone.radius, 0.75));
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
    if (zone.remainTime !== 0) {
      this.text = new Text(Math.floor(zone.remainTime / 1000), { fontFamily: 'Roboto', fontSize: 40, align: 'right' });
      this.text.position = new Point(65, 16);
      this.img = new LogoSprite(2 * zone.radius, 2 * zone.radius, logo);
      this.addChild(this.text);
      this.addChild(this.img);
    }
  }
  updatePos(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }
  updateRemainTime(remainTime) {
    if (remainTime > 0) {
      this.text.text = Math.floor(remainTime / 1000);
    } else if (remainTime < 0) {
      this.text.text = '重獲\n新生';
    }
  }
}

export { Sprite, CellSprite, FoodSprite, ZoneSprite, PlayerSprite, LogoSprite };
