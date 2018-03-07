import React, { Component } from 'react';

const makeid = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 7; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * This is the winning page of the game.
 * @extends Component */
class WinningPage extends Component {
  /**
   * @param {object} props - The props used to construct. */
  constructor(props) {
    super(props);
    console.log('winning');
  }

  /**
    * @return {JSX} - A syntax extension to JavaScript, which will be eventually compiled
    * into html code. */
  render() {
    return (
      <div>
        <div className="loginRoot">
          <div className="loginMenu">
            <h1 className="loginHeader">恭喜勝利</h1>
            <div className="info">台大南友之夜 - 新生南路</div>
            <div className="info">2018年3月25日 活大禮堂</div>
            <div className="lotterytext">請複製底下驗證碼，至抽獎連結填寫抽獎資訊</div>
            <div className="lotterycode">{makeid()}</div>
            <button className="lotterybutton"><a className="link" href="https://docs.google.com/forms/d/e/1FAIpQLSedEfl3SIryuS-WOYMjDS4KpAoDBTK9Wwmt4s3ZSWUGhfhfcg/formResponse">抽獎連結</a></button>
            <div className="maker">遊戲製作：詹雨安、許秉倫、駱佳駿</div>
          </div>
        </div>
      </div>
    );
  }
}

export default WinningPage;
