import React, { Component } from 'react';

class LoginBox extends Component {
  constructor(props) {
    super();
    this.state = {
      userList: [],
    };
    this.socket = props.socket;
    this.id = props.id;
  }

  componentDidMount() {
    this.socket.on('GET_USERLIST', (userList) => {
      this.setState({ userList });
    });
    this.socket.emit('EMIT_USERLIST');
  }
  componentWillUnmount() {
    this.socket.off('GET_USERLIST');
  }
  setTitle = () => {
    this.socket.emit('SET_NAME', { name: this.textInput.value, id: this.id });
    this.socket.emit('INIT', { id: this.id, name: this.name });
    this.props.handlelogin(this.textInput.value, this.character.value); // update app state
    this.textInput.value = '';
  }

  render() {
    return (
      <div className="loginRoot">
        <div className="loginMenu">
          <h1 className="loginHeader">NTUAA.io</h1>
          <h4 className="loginText">角色選擇</h4>
          <input className="loginInput" placeholder="名字" ref={(input) => { this.textInput = input; }} />
          <select className="custom-select-wrapper" ref={(input) => { this.character = input; }}>
            <option value="1">開場舞</option>
            <option value="2">創意劇</option>
            <option value="3">手語劇</option>
            <option value="4">金劇</option>
            <option value="5">會長劇</option>
            <option value="6">歌舞劇</option>
          </select>
          <button className="loginStart" onClick={this.setTitle}>開始遊戲</button>
        </div>
      </div>
    );
  }
}

export default LoginBox;
