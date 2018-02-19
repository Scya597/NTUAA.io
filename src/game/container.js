// @flow

import { Container, Point, Graphics } from 'pixi.js';
import { Sprite, CellSprite, FoodSprite, ZoneSprite } from './sprite';
import config from './config';

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
      console.log('get_player_data');
      let dead = true;
      playerList.forEach((player) => {
        if (player.zones[1]) {
          this.win = true;
          this.socket.emit('WIN');
        }
        player.cellList.forEach((cell) => {
          let sprite = this.children.find(child => child.id === cell.id);
          if (sprite === undefined) {
            sprite = new CellSprite(cell);
            this.addChild(sprite);
          }
          sprite.updatePos(cell.pos);
          sprite.updateCell(cell); // update size
          sprite.flag = true;
        });
        if (player.id === this.id) {
          dead = false;
          const mx = player.cellList.reduce((acc, cell) => acc + (cell.pos.x * cell.mass), 0);
          const my = player.cellList.reduce((acc, cell) => acc + (cell.pos.y * cell.mass), 0);
          const m = player.cellList.reduce((acc, cell) => acc + cell.mass, 0);
          this.centroid.set(mx / m, my / m);
          this.updateCamera(this.centroid);
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
   * It will trigger socket to turn on 'GET_FOODS_DATA' task.
   * So that when the server side emit this task, client side can update accordingly.
   * When receiving foodList from server.
   * We do the following things.
   * 1. Use foodList to update the sprites in this container.
   * 2. Remove childs which has already been removed in the database.
   */
  onGetFoodsData() {
    this.socket.on('GET_FOODS_DATA', (foodList) => {
      foodList.forEach((food) => {
        let sprite = this.children.find(child => child.id === food.id);
        if (sprite === undefined) {
          sprite = new FoodSprite(food);
          this.addChild(sprite);
        }
        sprite.updatePos(food.pos);
        sprite.flag = true;
      });

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
  onGetZonesData() {
    this.socket.on('GET_ZONE_DATA', (zoneList) => {
      zoneList.forEach((zone) => {
        let sprite = this.children.find(child => child.id === zone.id);
        if (sprite === undefined) {
          sprite = new ZoneSprite(zone);
          this.addChild(sprite);
        }
        sprite.updatePos({ x: zone.centre.x, y: zone.centre.y });
        sprite.flag = true;
      });
    });
  }
}

export { Container, PlayerContainer, FoodContainer, BgContainer, ZoneContainer };
