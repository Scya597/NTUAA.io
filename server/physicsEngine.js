import uuid from 'uuid/v1';

import Food from './entity/food';
import Vector2 from './space/vector2';
import Zone from './space/zone';

const updatePlayerPosition = (playerList, zoneList, setting) => {
  const dt = 1/60;
  playerList.forEach((player) => {
    player.cellList.forEach((cell) => {
      /* integrate EoM */
      cell.vel.subtractVectors(
        player.mousePos,
        cell.pos);

      cell.pos.add(
        cell.vel.clone().scale(1/60));

      /* clip to world boundary */
      const r = cell.getRadius();
      cell.pos.clipComponents(
        r, setting.worldWidth-r,
        r, setting.worldHeight-r);

      /* clip to zone boundaries */
      zoneList.forEach((zone) => {
        zone.doorkeep(player, cell.pos);
      });

    });

  });
};

const generateFoods = (foodList, setting) => {
  for (let i = 0; i < 400 - foodList.length; i += 1) {
    foodList.push(new Food({
      mass: 100,
      pos: new Vector2(
        Math.random() * setting.worldWidth,
        Math.random() * setting.worldHeight),
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
