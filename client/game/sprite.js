import { Sprite, Graphics, Texture, Container, Text, Point } from 'pixi.js';
import playerPNG1 from '../assets/player1.png';
import playerPNG2 from '../assets/player2.png';
import playerPNG3 from '../assets/player3.png';
import playerPNG4 from '../assets/player4.png';
import playerPNG5 from '../assets/player5.png';
import playerPNG6 from '../assets/player6.png';
import playerPNG7 from '../assets/player7.png';
import playerPNG8 from '../assets/player8.png';
import playerPNG9 from '../assets/player9.png';
import playerPNG10 from '../assets/player10.png';
import playerPNG11 from '../assets/player11.png';
import playerPNG12 from '../assets/player12.png';
import playerPNG13 from '../assets/player13.png';
import playerPNG14 from '../assets/player14.png';
import playerPNG15 from '../assets/player15.png';
import playerPNG16 from '../assets/player16.png';
import playerPNG17 from '../assets/player17.png';
import playerPNG18 from '../assets/player18.png';
import playerPNG19 from '../assets/player19.png';
import playerPNG20 from '../assets/player20.png';
import playerPNG21 from '../assets/player21.png';
import playerPNG22 from '../assets/player22.png';
import playerPNG23 from '../assets/player23.png';
import playerPNG24 from '../assets/player24.png';
import playerPNG25 from '../assets/player25.png';
import playerPNG26 from '../assets/player26.png';
import playerPNG27 from '../assets/player27.png';
import playerPNG28 from '../assets/player28.png';
import playerPNG29 from '../assets/player29.png';
import playerPNG30 from '../assets/player30.png';
import playerPNG31 from '../assets/player31.png';
import playerPNG32 from '../assets/player32.png';
import playerPNG33 from '../assets/player33.png';
import logo from '../assets/logo.png';
import { setting } from '../../gameConfig';

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
 * @param {Circle} radius - circle's radius.
 * @param {Circle} color - circle's color.
 * @param {Circle} alpha - circle's alphas.
 * @return {PIXI.Texture} - A PIXI.Texture to construct a sprite.
 */
function generateCircleTexture(circle, radius, color, alpha = 1) {
  const graphics = new Graphics();
  graphics.lineStyle();
  graphics.beginFill(color);
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
   * @param {string} character - Player's character
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
    } else if (character === '8') {
      super(Texture.fromImage(playerPNG8, true, { resolution: 200, antialias: true }));
    } else if (character === '9') {
      super(Texture.fromImage(playerPNG9, true, { resolution: 200, antialias: true }));
    } else if (character === '10') {
      super(Texture.fromImage(playerPNG10, true, { resolution: 200, antialias: true }));
    } else if (character === '11') {
      super(Texture.fromImage(playerPNG11, true, { resolution: 200, antialias: true }));
    } else if (character === '12') {
      super(Texture.fromImage(playerPNG12, true, { resolution: 200, antialias: true }));
    } else if (character === '13') {
      super(Texture.fromImage(playerPNG13, true, { resolution: 200, antialias: true }));
    } else if (character === '14') {
      super(Texture.fromImage(playerPNG14, true, { resolution: 200, antialias: true }));
    } else if (character === '15') {
      super(Texture.fromImage(playerPNG15, true, { resolution: 200, antialias: true }));
    } else if (character === '16') {
      super(Texture.fromImage(playerPNG16, true, { resolution: 200, antialias: true }));
    } else if (character === '17') {
      super(Texture.fromImage(playerPNG17, true, { resolution: 200, antialias: true }));
    } else if (character === '18') {
      super(Texture.fromImage(playerPNG18, true, { resolution: 200, antialias: true }));
    } else if (character === '19') {
      super(Texture.fromImage(playerPNG19, true, { resolution: 200, antialias: true }));
    } else if (character === '20') {
      super(Texture.fromImage(playerPNG20, true, { resolution: 200, antialias: true }));
    } else if (character === '21') {
      super(Texture.fromImage(playerPNG21, true, { resolution: 200, antialias: true }));
    } else if (character === '22') {
      super(Texture.fromImage(playerPNG22, true, { resolution: 200, antialias: true }));
    } else if (character === '23') {
      super(Texture.fromImage(playerPNG23, true, { resolution: 200, antialias: true }));
    } else if (character === '24') {
      super(Texture.fromImage(playerPNG24, true, { resolution: 200, antialias: true }));
    } else if (character === '25') {
      super(Texture.fromImage(playerPNG25, true, { resolution: 200, antialias: true }));
    } else if (character === '26') {
      super(Texture.fromImage(playerPNG26, true, { resolution: 200, antialias: true }));
    } else if (character === '27') {
      super(Texture.fromImage(playerPNG27, true, { resolution: 200, antialias: true }));
    } else if (character === '28') {
      super(Texture.fromImage(playerPNG28, true, { resolution: 200, antialias: true }));
    } else if (character === '29') {
      super(Texture.fromImage(playerPNG29, true, { resolution: 200, antialias: true }));
    } else if (character === '30') {
      super(Texture.fromImage(playerPNG30, true, { resolution: 200, antialias: true }));
    } else if (character === '31') {
      super(Texture.fromImage(playerPNG31, true, { resolution: 200, antialias: true }));
    } else if (character === '32') {
      super(Texture.fromImage(playerPNG32, true, { resolution: 200, antialias: true }));
    } else {
      super(Texture.fromImage(playerPNG33, true, { resolution: 200, antialias: true }));
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
/**
 * A class extends from PIXI.Sprite to define
 * convenient methods for easily constructing or updating a player sprite.
 * @extends PIXI.Sprite */
class PlayerSprite extends Container {
  /**
   * Create a PlayerSprite from given params.
   * @param {object} cell - The cell of player
   * @param {string} name - The name of player
   * @param {string} character - The character's value of player
   * @param {number} hp - The hp of player
   */
  constructor(cell, name, character, hp = '0') {
    super();
    this.name = name;
    this.cell = new CellSprite(cell, character);
    this.nameText = new Text(`${this.name}: ${hp}`, { fontFamily: 'Arial', fontSize: 15, align: 'center' });
    this.nameText.position = new Point(0, 60);
    this.addChild(this.cell);
    this.addChild(this.nameText);
  }
  /**
   * Update player's position, hp, name
   * @param {object} player - Player's current data
   * @param {object} pos - Player's current position */
  update(player, pos) {
    // update pos
    this.x = pos.x;
    this.y = pos.y;

    // update angle
    const { mousePos } = player;
    const delta = { x: mousePos.x - pos.x, y: -(mousePos.y - pos.y) };
    this.cell.rotation = Math.atan2(delta.x, delta.y);
    // update hp
    if (player.score !== setting.playerBulletLimit * 100) {
      this.nameText.text = `${this.name}: ${player.score / 100}`;
    } else {
      this.nameText.text = `${this.name}: FULL`;
    }
  }
}
/**
 * A class extends from PIXI.Sprite to define
 * convenient methods for easily constructing or updating a food sprite.
 * @extends PIXI.Sprite */
class FoodSprite extends Sprite {
  /**
   * Create a foodSprite from the data in food.
   * @param {Food} food - A food object */
  constructor(food) {
    super(generateCircleTexture(food, getRadius(setting.foodMass), food.color));
    this.id = food.id;
    this.x = food.pos.x;
    this.y = food.pos.y;
    this.dead = false;
    this.anchor.set(0.5, 0.5);
    console.log('create');
  }
  /**
   * Update food's position. (which will only be used by bullet-like foods)
   * @param {object} pos - Food's current position */
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
   * Create a LogoSprite from given params.
   * @param {number} w - width of logo
   * @param {number} h - height of logo
   * @param {image} img - The img of logo
   */
  constructor(w, h, img) {
    super(Texture.fromImage(img, true, { resolution: 200, antialias: true }));
    this.width = w;
    this.height = h;
    this.anchor.set(0.5, 0.5);
  }
}

/**
 * A class extends from PIXI.Sprite to define
 * convenient methods for easily constructing or updating a zone sprite.
 * @extends PIXI.Sprite */
class ZoneSprite extends Sprite {
  /**
   * Create a zoneSprite from the data in zone.
   * @param {Zone} zone - A zone object */
  constructor(zone) {
    super(generateCircleTexture(zone, zone.radius, zone.color, 0.75));
    /**
     * Sprite's uuid
     * @member {string} */
    this.id = zone.id;
    this.x = zone.centre.x;
    this.y = zone.centre.y;
    this.anchor.set(0.5, 0.5);
    if (zone.remainTime !== 0) {
      this.img = new LogoSprite(2 * zone.radius, 2 * zone.radius, logo);
      this.addChild(this.img);
    }
  }
}

export { Sprite, CellSprite, FoodSprite, ZoneSprite, PlayerSprite, LogoSprite };
