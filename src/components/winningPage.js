import React, { Component } from 'react';

class WinningPage extends Component {
  constructor() {
    super();
    this.sendName = this.sendName.bind(this);
  }

  sendName() {
    console.log(this.name.value);
  }

  render() {
    return (
      <div className="loginRoot">
        <div className="loginMenu">
          <h1 className="loginHeader">恭喜勝利！</h1>
          <input className="loginInput" placeholder="請輸入FB姓名提交抽獎" ref={(input) => { this.name = input; }} />
          <button className="loginStart" onClick={this.sendName}>送出</button>
        </div>
      </div>
    );
  }
}

export default WinningPage;
