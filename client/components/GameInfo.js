import React from 'react';
import { setting } from '../../gameConfig';

const GameInfo = (props) => {
  let hp = '';
  if (props.hp === setting.playerBulletLimit * 100) {
    hp = 'FULL';
  } else {
    hp = props.hp / 100;
  }
  return (
    <div className="game-info" >
      SCORE: {hp}
      <br />
      X: {Math.floor(props.pos.x)}  Y: {Math.floor(props.pos.y)}
      <br />
      吃滿 {setting.zoneAccessLimit} 顆子彈可進入中央戰鬥場
      <br />
      每輪 {setting.zoneAccessSeconds} 秒倒數結束時
      <br />
      首位進入場中心新生南路者
      <br />
      將得勝並獲抽獎資格
    </div>
  );
};

export default GameInfo;
