import React, { Component } from 'react';
import { socketTask as task } from '../../gameConfig';

/**
 * This is the login page of the game.
 * @extends Component */
class LoginBox extends Component {
  /**
   * @param {object} props - The props used to construct.
   * @param {uuid} props.id - The id of current player. */
  constructor(props) {
    super();
    this.state = {
      showWarning: false,
    };
    this.socket = props.socket;
    this.id = props.id;
    this.setTitle = this.setTitle.bind(this);
    this.showWarning = this.showWarning.bind(this);
  }

  /**
   * It send the players id, name, and character's value into backend to create player. */
  setTitle() {
    if (this.textInput.value === '') {
      this.setState({ showWarning: true });
    } else {
      if (this.character.value === '9') {
        const characterNum = Math.floor(Math.random() * 12) + 9;
        this.socket.emit(task.INIT, {
          id: this.id, name: this.textInput.value, character: characterNum.toString(),
        });
      } else if (this.character.value === '10') {
        const characterNum = Math.floor(Math.random() * 11) + 22;
        this.socket.emit(task.INIT, {
          id: this.id, name: this.textInput.value, character: characterNum.toString(),
        });
      } else {
        this.socket.emit(task.INIT, {
          id: this.id, name: this.textInput.value, character: this.character.value,
        });
      }
      this.props.handlelogin(this.textInput.value); // update app state
      this.textInput.value = '';
    }
  }

  /**
    * It shows warning if the player press start without typing their name
    * @return {JSX} - The warning messages */
  showWarning() {
    if (this.state.showWarning) {
      return (<div className="warning">請輸入名字！</div>);
    }
  }

  /**
    * @return {JSX} - A syntax extension to JavaScript, which will be eventually compiled
    * into html code. */
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
            <option value="9">特殊角色系列ㄧ</option>
            <option value="10">特殊角色系列二</option>
            <option value="29">哲豪</option>
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
