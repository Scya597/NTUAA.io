import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import uuid from 'uuid/v1';
import LoginBox from './loginBox';
import WinningPage from './winningPage';
import Pixi from '../game/Pixi';

/**
 * This is the entrance of the game. It shows the login page at the beginning and switch into
 * game page after player typed their name, selected their character, and pressed START.
 * @extends Component */
class App extends Component {
  /**
   * Init socket config. */
  constructor() {
    super();
    this.state = {
      endpoint: 'http://35.229.129.64/',
      login: 0,
    };
    const { endpoint } = this.state;
    this.id = uuid();
    this.socket = socketIOClient(endpoint, { query: { id: this.id } });
    this.handleLogin = this.handleLogin.bind(this);
    this.loseGame = this.loseGame.bind(this);
    this.winGame = this.winGame.bind(this);
    this.renderPage = this.renderPage.bind(this);
  }

  /**
   * It set this.state.login to 1 in order to switch into game page. */
  handleLogin() {
    this.setState({ login: 1 });
    this.socket.connect();
  }
  /**
   * It set this.state.login to 2 in order to switch into winning page. */
  winGame() {
    this.socket.disconnect();
    console.log('新生南路XD');
    this.setState({
      login: 2,
    });
  }
  /**
   * It set this.state.login to 0 in order to switch/redirect into login page. */
  loseGame() {
    this.socket.disconnect();
    console.log('人生好南QQ');
    this.setState({
      login: 0,
    });
  }

  /**
   * It choose which place to render by this.state.login
   * 0: login page
   * 1: game page
   * 2: winning page
   * @return {JSX} - A syntax extension to JavaScript, which will be eventually compiled
   * into html code. */
  renderPage() {
    if (this.state.login === 1) {
      return (<Pixi
        socket={this.socket}
        id={this.id}
        loseGame={this.loseGame}
        winGame={this.winGame}
      />);
    } else if (this.state.login === 0) {
      return <LoginBox handlelogin={this.handleLogin} socket={this.socket} id={this.id} />;
    } else {
      return <WinningPage />;
    }
  }
  /**
   * @return {JSX} - A syntax extension to JavaScript, which will be eventually compiled
   * into html code. */
  render() {
    return (
      <div>
        {this.renderPage()}
      </div>
    );
  }
}

export default App;
