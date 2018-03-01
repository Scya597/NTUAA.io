import React, { Component } from 'react';

class LoginBox extends Component {
  constructor(props) {
    super();
    this.state = {
      userList: [],
      showWarning: false,
    };
    this.socket = props.socket;
    this.id = props.id;
    this.setTitle = this.setTitle.bind(this);
    this.showWarning = this.showWarning.bind(this);
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

  setTitle() {
    if (this.textInput.value === '') {
      this.setState({ showWarning: true });
    } else {
      if (this.character.value === '9') {
        const specialCharacter = Math.floor(Math.random() * 6) + 9;
        console.log(specialCharacter);
        this.socket.emit('SET_NAME', { name: this.textInput.value, id: this.id, character: specialCharacter });
        this.socket.emit('INIT', { id: this.id, name: this.textInput.value, character: specialCharacter });
      } else {
        this.socket.emit('SET_NAME', { name: this.textInput.value, id: this.id, character: this.character.value });
        this.socket.emit('INIT', { id: this.id, name: this.textInput.value, character: this.character.value });
      }
      this.props.handlelogin(this.textInput.value); // update app state
      this.textInput.value = '';
    }
  }

  showWarning() {
    if (this.state.showWarning) {
      return (<div className="warning">請輸入名字！</div>);
    }
  }

  render() {
    return (
      <div className="loginRoot">
        <div className="loginMenu">
          <h1 className="loginHeader">NTUAA.io</h1>
          <div className="rule">操作：WASD移動、滑鼠點擊開槍</div>
          <div className="rule">進入場中央黃色區域者勝，可獲抽獎資格</div>
          <h4 className="loginText">角色選擇</h4>
          <select className="custom-select-wrapper" ref={(input) => { this.character = input; }}>
            <option value="1">開場舞</option>
            <option value="2">創意劇</option>
            <option value="3">手語劇</option>
            <option value="4">金劇</option>
            <option value="5">會長劇</option>
            <option value="6">歌舞劇</option>
            <option value="7">老人舞</option>
            <option value="8">器材組</option>
            <option value="9">特殊角色</option>
          </select>
          <input className="loginInput" placeholder="名字" ref={(input) => { this.textInput = input; }} required="required" />
          { this.showWarning() }
          <button className="loginStart" onClick={this.setTitle}>開始遊戲</button>
          <div className="maker">遊戲製作：詹雨安、許秉倫、駱佳駿</div>
        </div>
      </div>
    );
  }
}

export default LoginBox;
