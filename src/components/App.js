import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import uuid from 'uuid/v1';
import LoginBox from './loginBox';
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
  }

  handleLogin(name) {
    console.log('handleLogin: this.setState({ login: 1, name })');
    this.setState({ login: 1, name });
  }

  render() {
    return (
      <div>
        {this.state.login === 1
          ? <Pixi socket={this.socket} id={this.id} name={this.state.name} />
          : <LoginBox handlelogin={this.handleLogin} socket={this.socket} id={this.id} />}
      </div>
    );
  }
}

export default App;
