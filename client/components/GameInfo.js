import React from 'react';

const GameInfo = props => (
  <div className="game-info" >
    SCORE: {props.hp}
    <br />
    X: {Math.floor(props.pos.x)}
    <br />
    Y: {Math.floor(props.pos.y)}
  </div>
);

export default GameInfo;
