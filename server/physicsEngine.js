import uuid from 'uuid/v1';

import Food from './entity/food';

const updatePlayerPosition = (playerList, setting) => {
  playerList.forEach((player) => {
    player.cellList.forEach((cell) => {
      cell.vel.x = player.mousePos.x - cell.pos.x;
      cell.vel.y = player.mousePos.y - cell.pos.y;
    });

    player.cellList.forEach((cell) => {
      const cellRadius = cell.getRadius();
      if ((cell.pos.x + (cell.vel.x * (1 / 60))) - cellRadius >= 0 &&
        (cell.pos.x + (cell.vel.x * (1 / 60))) + cellRadius <= setting.worldWidth) {
        cell.pos.x += cell.vel.x * (1 / 60);
      }
      if ((cell.pos.y + (cell.vel.y * (1 / 60))) - cellRadius >= 0 &&
        (cell.pos.y + (cell.vel.y * (1 / 60))) + cellRadius <= setting.worldHeight) {
        cell.pos.y += cell.vel.y * (1 / 60);
      }
    });
  });
};

const generateFoods = (foodList, setting) => {
  for (let i = 0; i < 400 - foodList.length; i += 1) {
    foodList.push(new Food({
      mass: 100,
      pos: { x: Math.random() * setting.worldWidth, y: Math.random() * setting.worldHeight },
      id: uuid(),
      color: 0x111111,
      isEaten: false,
    }));
  }
};

const checkOneFoodEaten = (cell, food) => {
  if (Math.sqrt(((cell.pos.x - food.pos.x) ** 2) +
  ((cell.pos.y - food.pos.y) ** 2)) < cell.getRadius()) {
    food.isEaten = true;
    return true;
  }
};

const checkAllFoodEaten = (playerList, foodList) => {
  for (let i = 0; i < playerList.length; i += 1) {
    for (let k = 0; k < foodList.length; k += 1) {
      if(checkOneFoodEaten(playerList[i].cellList[0], foodList[k])) {
        playerList[i].score += 1;
        console.log(playerList[i].score);
      };
    }
  }
};

const removeEatenFoods = (foodList) => {
  const isEatenList = [];
  for (let i = 0; i < foodList.length; i += 1) {
    if (foodList[i].isEaten) {
      isEatenList.push(i);
    }
  }
  for (let i = isEatenList.length - 1; i >= 0; i -= 1) {
    foodList.splice(isEatenList[i], 1);
  }
};


export {
  updatePlayerPosition,
  generateFoods,
  checkAllFoodEaten,
  removeEatenFoods,
};
