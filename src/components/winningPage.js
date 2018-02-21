import React, { Component } from 'react';

class WinningPage extends Component {
  // constructor(props) {
  //   super();
  // }
  render() {
    return (
      <div className="loginRoot">
        <div className="loginMenu">
          <h1 className="loginHeader">恭喜勝利！</h1>
          <input className="loginInput" placeholder="請輸入FB姓名提交抽獎" ref={(input) => { this.textInput = input; }} />
          <button className="loginStart">START</button>
        </div>
      </div>
    );
  }
}

export default WinningPage;
