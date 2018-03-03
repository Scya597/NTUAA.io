import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import uuid from 'uuid/v1';
import LoginBox from './loginBox';
import WinningPage from './winningPage';
import Pixi from '../game/Pixi';

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: 'localhost:8080',
      login: 0,
      name: '',
    };
    const { endpoint } = this.state;
    this.id = uuid();
    this.socket = socketIOClient(endpoint, { query: { id: this.id } });
    this.handleLogin = this.handleLogin.bind(this);
    this.loseGame = this.loseGame.bind(this);
    this.winGame = this.winGame.bind(this);
    this.renderPage = this.renderPage.bind(this);
  }

  handleLogin(name) {
    this.setState({ login: 1, name });
    this.socket.connect();
  }

  winGame() {
    this.socket.disconnect();
    console.log('新生南路XD');
    this.setState({
      login: 2,
    });
  }

  loseGame() {
    this.socket.disconnect();
    console.log('人生好南QQ');
    this.setState({
      login: 0,
    });
  }

  renderPage() {
    if (this.state.login === 1) {
      return (<Pixi
        socket={this.socket}
        id={this.id}
        name={this.state.name}
        loseGame={this.loseGame}
        winGame={this.winGame}
      />);
    } else if (this.state.login === 0) {
      return <LoginBox handlelogin={this.handleLogin} socket={this.socket} id={this.id} />;
    } else {
      return <WinningPage />;
    }
  }

  render() {
    return (
      <div>
        {this.renderPage()}
      </div>
    );
  }
}

export default App;
