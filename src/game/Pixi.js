import React, { Component } from 'react';
import { Application } from 'pixi.js';
import key from 'keymaster';
import { Container, PlayerContainer, FoodContainer, BgContainer } from './container';

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
  }
  /**
   * Setup pixi configuration
   */
  componentDidMount() {
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
    this.gameScene.addChild(this.bgContainer, this.playerContainer, this.foodContainer);

    this.socket.emit('INIT', { id: this.id, name: this.name });

    this.initTicker();
    this.initSpaceEmitter();
    this.playerContainer.onGetPlayersData();
    this.foodContainer.onGetFoodsData();
    this.bgContainer.generateBg();
  }
  /**
   * Initialize app.ticker by adding some tasks insides.
   */
  initTicker() {
    this.app.ticker.add(() => {
      this.socket.emit('GET_DATA');
      this.socket.emit('MOUSE_MOVE', { mousePos: this.app.renderer.plugins.interaction.mouse.getLocalPosition(this.gameScene), id: this.id });
      // this.playerContainer.onGetPlayersData();
    });
  }
  /**
   * Initialize space event.
   * When 'space' is pressed, client will emit 'PRESS_SPACE' task to server.
   */
  initSpaceEmitter() {
    key('space', () => {
      this.socket.emit('PRESS_SPACE', { id: this.id });
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
  }
  /**
   * @return {jsx} < div className = 'pixi' >
   */
  render() {
    return (
      <div className="pixi" ref={(pixi) => { this.pixi = pixi; }} />
    );
  }
}

export default Pixi;
