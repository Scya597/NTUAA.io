// @flow

import { Container, Point, Graphics, Text } from 'pixi.js';
import { Sprite, FoodSprite, ZoneSprite, PlayerSprite, LogoSprite } from './sprite';
import config from '../../gameConfig';
// import bg from '../assets/bg.jpg';

/** PlayerContainer class extended from PIXI.container
 * to define methods for easily manipulating the data insides.
 * @extends PIXI.Container */
class PlayerContainer extends Container {
  /**
   * Create a PlayerContainer
   * @param {object} arg - The arg used to construct.
   * @param {object} arg.socket - The socket to connect with server side.
   * @param {string} arg.id - The player's uuid.
   * @param {function} arg.updateCamera - The callback function to align camera.
   */
  constructor(arg) {
    super();
    /**
     * Client side socket object to connect with server
     * @member {Object} */
    this.socket = arg.socket;
    /**
     * Client side uuid
     * @member {string} */
    this.id = arg.id;
    /**
     * The callback function to align camera.
     * @member {function} */
    this.updateCamera = arg.updateCamera;
    /**
     * A point representing the centroid of all the cells the player owns.
     * @member {PIXI.Point} */
    this.centroid = new Point();
    this.loseGame = arg.loseGame;
    this.winGame = arg.winGame;
    this.win = false;
    this.updateHp = arg.updateHp;
  }
  /**
   * When this function is called.
   * It will trigger socket to turn on 'GET_PLAYERS_DATA' task.
   * So that when the server side emit this task, client side can update accordingly.
   * When receiving playerList from server.
   * We do the following things.
   * 1. Use playerList to update the sprite in this container.
   * 2. Align camera by calculating the centroid.
   * 3. Remove childs which has already been removed in the database.
   */
  onGetPlayersData() {
    this.socket.on('GET_PLAYERS_DATA', (playerList) => {
      let dead = true;
      playerList.forEach((player) => {
        if (player.zones[1]) {
          if (player.id === this.id) {
            this.win = true;
            this.socket.emit('WIN');
          }
        }
        player.cellList.forEach((cell) => {
          let sprite = this.children.find(child => child.id === cell.id);
          if (sprite === undefined) {
            sprite = new PlayerSprite(cell, player.name, player.character);
            this.addChild(sprite);
          }
          sprite.update(player, cell.pos);
          sprite.flag = true;
        });
        if (player.id === this.id) {
          dead = false;
          const mx = player.cellList.reduce((acc, cell) => acc + (cell.pos.x * cell.mass), 0);
          const my = player.cellList.reduce((acc, cell) => acc + (cell.pos.y * cell.mass), 0);
          const m = player.cellList.reduce((acc, cell) => acc + cell.mass, 0);
          this.centroid.set(mx / m, my / m);
          this.updateCamera(this.centroid);
          this.updateHp(player.score);
        }
      });
      if (dead === true) {
        if (this.win === false) {
          this.loseGame();
        } else {
          this.winGame();
        }
      }
      const arr = [];
      // Store index of child which does not update in this round into arr.
      for (let i = 0; i < this.children.length; i += 1) {
        if (this.children[i].flag === false) {
          arr.push(i);
        }
        this.children[i].flag = false; // reset
      }
      // Remove child accordingly.
      arr.reverse().forEach((i) => {
        this.removeChildAt(i);
      });
    });
  }
}

/** FoodContainer class extended from PIXI.container
 * to define methods for easily manipulating the data insides.
 * @extends PIXI.Container */
class FoodContainer extends Container {
  /**
   * Create a FoodContainer
   * @param {object} arg - The arg used to construct.
   * @param {object} arg.socket - The socket to connect with server side.
   */
  constructor(arg) {
    super();
    /**
     * Client side socket object to connect with server
     * @member {Object} */
    this.socket = arg.socket;
  }

  /**
   * When this function is called.
   * It will trigger socket to turn on 'GET_BULLETS_DATA' task.
   * So that when the server side emit this task, client side can update accordingly.
   * When receiving bulletList from server.
   * We do the following things.
   * 1. Find bullets from our FoodSprite list by id in the bulletList.
   * 2. Update the bullets' position.
   */
  onGetBulletsData() {
    this.socket.on('GET_BULLETS_DATA', (bulletList) => {
      bulletList.forEach((bullet) => {
        const sprite = this.children.find(child => child.id === bullet.id);
        if (sprite !== undefined) {
          sprite.updatePos(bullet.pos);
        }
      });
    });
  }

  /**
   * When this function is called.
   * It will trigger socket to turn on 'GET_NEW_FOODS_DATA' task.
   * So that when the server side emit this task, client side can update accordingly.
   * When receiving new foodList from server.
   * We do the following things.
   * 1. Check whether the foods in new foodList already exists.
   * 2. If not, then create the food sprites.
   */
  onGetNewFoodsData() {
    this.socket.on('GET_NEW_FOODS_DATA', (foodList) => {
      foodList.forEach((food) => {
        let sprite = this.children.find(child => child.id === food.id);
        if (sprite === undefined) {
          sprite = new FoodSprite(food);
          this.addChild(sprite);
        }
      });
    });
  }

  /**
   * When this function is called.
   * It will trigger socket to turn on 'GET_IS_EATEN_FOODS_DATA' task.
   * So that when the server side emit this task, client side can update accordingly.
   * When receiving foodIdList from server.
   * We do the following things.
   * 1. Find isEaten foods from FoodSprite.
   * 2. Remove isEaten foods from the food container.
   */
  onGetIsEatenFoodsData() {
    this.socket.on('GET_IS_EATEN_FOODS_DATA', (foodIdList) => {
      foodIdList.forEach((foodId) => {
        const sprite = this.children.find(child => child.id === foodId);
        sprite.dead = true;
      });

      const arr = [];

      for (let i = 0; i < this.children.length; i += 1) {
        if (this.children[i].dead === true) {
          arr.push(i);
        }
      }
      // Remove child accordingly.
      arr.reverse().forEach((i) => {
        this.removeChildAt(i);
      });
    });
  }
}
/** BgContainer class extended from PIXI.container
 * to setup the map of the game
 * @extends PIXI.Container */
class BgContainer extends Container {
  /**
   * When this function is called.
   * It will render the map of game.
   */
  generateBg() {
    this.addChild(BgContainer.generateRect());
    // this.img = new LogoSprite(config.worldWidth, config.worldHeight, bg);
    // this.img.position = new Point(config.worldWidth / 2, config.worldHeight / 2);
    // this.addChild(this.img);
  }
  /**
   * Generate a Rect Sprite
   * @return {PIXI.Sprite} - A Rect PIXI.Sprite representing the map of the gmae.
   * @static
   */
  static generateRect() {
    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, config.worldWidth, config.worldHeight);
    graphics.endFill();
    const sprite = new Sprite(graphics.generateCanvasTexture());
    return sprite;
  }
}

/** ZoneContainer class extended from PIXI.container
 * to define methods for easily manipulating the data insides.
 * @extends PIXI.Container */
class ZoneContainer extends Container {
  /**
   * Create a ZoneContainer
   * @param {object} arg - The arg used to construct.
   * @param {object} arg.socket - The socket to connect with server side.
   */
  constructor(arg) {
    super();
    /**
     * Client side socket object to connect with server
     * @member {Object} */
    this.socket = arg.socket;
  }

  /**
   * When this function is called.
   * It will trigger socket to turn on 'GET_ZONE_DATA' task.
   * So that when the server side emit this task, client side can update accordingly.
   * When receiving zoneList from server.
   * We do the following things.
   * 1. Check whether the zones in zoneList already exists.
   * 2. If not, then create the zone sprites.
   * 3. If the remainTime of zone is not zero, we'll add a text o it's sprite to show it.
   */
  getZonesData() {
    this.socket.on('GET_ZONE_DATA', (zoneList) => {
      zoneList.forEach((zone) => {
        let sprite = this.children.find(child => child.id === zone.id);
        if (sprite === undefined) {
          sprite = new ZoneSprite(zone);
          this.addChild(sprite);
        }
        if (zone.remainTime !== 0) {
          this.text = new Text(Math.floor(zone.remainTime / 1000), { fontFamily: 'Roboto', fontSize: 40, align: 'right' });
          this.text.position = new Point(65, 16);
          sprite.addChild(this.text);
        }
      });
    });
  }

  /**
   * When this function is called.
   * It will trigger socket to turn on 'GET_ZONE_TIME' task.
   * So that when the server side emit this task, client side can update accordingly.
   * When receiving remainTime of zone two from server.
   * We do the following things.
   * 1. Update the text of remainTime of zone two
   * 2. If remainTime < 0, change the text into '重獲新生'
   */
  onGetTimeData() {
    this.socket.on('GET_ZONE_TIME', (remainTime) => {
      if (remainTime > 0) {
        this.text.text = Math.floor(remainTime / 1000);
      } else if (remainTime < 0) {
        this.text.text = '重獲\n新生';
      }
    });
  }
}

export { Container, PlayerContainer, FoodContainer, BgContainer, ZoneContainer };
