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
    this.props.handlelogin(this.textInput.value); // update app state
    this.textInput.value = '';
  }

  render() {
    return (
      <div className="loginRoot">
        <div className="loginMenu">
          <h1 className="loginHeader">NTUAA.io</h1>
          <h4 className="loginText">角色選擇</h4>
          <input className="loginInput" placeholder="名字" ref={(input) => { this.textInput = input; }} />
          <select className="custom-select-wrapper">
            <option>開場舞</option>
            <option>創意劇</option>
            <option>手語劇</option>
            <option>金劇</option>
            <option>會長劇</option>
            <option>歌舞劇</option>
          </select>
          <button className="loginStart" onClick={this.setTitle}>開始遊戲</button>
        </div>
      </div>
    );
  }
}

export default LoginBox;
