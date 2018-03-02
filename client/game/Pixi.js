import React, { Component } from 'react';
import { Application } from 'pixi.js';
import key from 'keymaster';
import { Container, PlayerContainer, FoodContainer, BgContainer, ZoneContainer } from './container';
import GameInfo from '../components/GameInfo';

/** A react component representing the whole pixi game. */
class Pixi extends Component {
  /**
   * Create a Pixi.
   * @param {object} props - The props to construct a pixi object.
   * @param {object} props.socket - The socket to connect with server side.
   * @param {string} props.id - The player's uuid.
   * @param {name} props.name - The player's name.
   */
  constructor(props) {
    super();
    this.updateCamera = this.updateCamera.bind(this);
    /**
     * Client side socket object to connect with server
     * @member {Object} */
    this.socket = props.socket;
    /**
     * Client side uuid
     * @member {string} */
    this.id = props.id;
    /**
     * Player's name
     * @member {string} */
    this.name = props.name;
    this.click = false;

    this.state = {
      hp: 0,
      pos: {
        x: 0,
        y: 0,
      },
    };
  }
  componentDidMount() {
    console.log('mount');
    this.setup();
  }
  componentWillUnmount() {
    console.log('unmount');
    this.socket.off('GET_PLAYERS_DATA');
    this.socket.off('GET_BULLETS_DATA');
    this.socket.off('GET_NEW_FOODS_DATA');
    this.socket.off('GET_IS_EATEN_FOODS_DATA');
    this.socket.off('GET_ZONE_TIME');
    this.socket.off('GET_ZONE_DATA');
    this.app.ticker.destroy();
    this.app.stop();
  }
  /**
   * Setup pixi configuration
   */
  setup() {
    const appConfig = {
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
    };
    /**
     * A PIXI.Application representing the whole game.
     * It contains renderer, ticker and root container.
     * @member {PIXI.Application} */
    this.app = new Application(appConfig);
    this.pixi.appendChild(this.app.view);
    /**
     * A PIXI.Container representing the camera.
     * It contains [playerContainer]{@link Pixi#playerContainer},
     * [foodContainer]{@link Pixi#foodContainer} and [bgContainer]{@link Pixi#bgContainer}.
     * @member  {PIXI.Container} */
    this.gameScene = new Container();
    this.gameScene.interactive = true;
    this.gameScene.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.app.stage.addChild(this.gameScene);
    this.app.stage.interactive = true;
    this.app.stage.on('mousedown', () => { this.click = true; });
    this.app.stage.on('mouseup', () => { this.click = false; });
    window.onresize = () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.gameScene.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    };
    /**
     * A PlayerContainer wrapped inside [this.gameScene]{@link Pixi#gameScene}.
     * It handles all the operation of players.
     * @member  {PlayerContainer} */
    this.playerContainer = new PlayerContainer({
      socket: this.socket,
      id: this.id,
      updateCamera: this.updateCamera,
      loseGame: this.props.loseGame,
      winGame: this.props.winGame,
      updateHp: this.updateHp,
    });
    /**
     * A FoodContainer wrapped inside [this.gameScene]{@link Pixi#gameScene}.
     * It handles all the operation of foods.
     * @member {FoodContainer} */
    this.foodContainer = new FoodContainer({ socket: this.socket });
    /**
     * A BgContainer wrapped inside [this.gameScene]{@link Pixi#gameScene}.
     * It sets up the map of the game.
     * @member {BgContainer} */
    this.bgContainer = new BgContainer();
    this.zoneContainer = new ZoneContainer({ socket: this.socket });
    this.gameScene.addChild(
      this.bgContainer,
      this.zoneContainer,
      this.foodContainer,
      this.playerContainer,
    );
    this.initTicker();

    this.playerContainer.onGetPlayersData();
    // this.foodContainer.onGetFoodsData();

    this.foodContainer.onGetBulletsData();
    this.foodContainer.onGetNewFoodsData();
    this.foodContainer.onGetIsEatenFoodsData();

    this.zoneContainer.onGetTimeData();
    this.zoneContainer.getZonesData();
    this.bgContainer.generateBg();
    this.socket.emit('GET_INIT_ZONE_DATA');
    this.socket.emit('GET_INIT_FOOD_DATA');
  }
  /**
   * Initialize app.ticker by adding some tasks insides.
   */
  initTicker() {
    this.app.ticker.add(() => {
      this.socket.emit('GET_DATA');

      const controlKeys = [
        32,
        37, 38, 39, 40,
        65, 87, 68, 83,
      ];
      const keysDown = [];
      for (let i = 0; i < controlKeys.length; i += 1) {
        keysDown[controlKeys[i]] = key.isPressed(controlKeys[i]) ? 1 : 0;
      }

      this.socket.emit('STATE_UPDATE', {
        mousePos: this.app.renderer.plugins.interaction.mouse.getLocalPosition(this.gameScene),
        mouseDown: this.click,
        keysDown,
        id: this.id,
      });
    });
  }

  /**
   * Align [this.gameScene]{@link Pixi#gameScene} with pos.
   * @param {object} pos - A position for the camera to be aligned with.
   * @param {number} pos.x - positon x.
   * @param {number} pos.y - positon y.
   */
  updateCamera(pos) {
    this.gameScene.pivot.copy(pos);
    this.setState({ pos });
  }
  updateHp = (_hp) => {
    let { hp } = this.state;
    hp = _hp;
    this.setState({ hp });
  }
  /**
   * @return {jsx} < div className = 'pixi' >
   */
  render() {
    const { hp, pos } = this.state;
    return (
      <div>
        <div className="pixi" ref={(pixi) => { this.pixi = pixi; }} />
        <GameInfo hp={hp} pos={pos} />
      </div>
    );
  }
}

export default Pixi;
