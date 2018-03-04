import uuid from 'uuid/v1';

import Food from './entity/food';
import Vector2 from './space/vector2';
import { setting } from '../gameConfig';

const checkAllPlayerDead = (playerList) => {
  for (let i = playerList.length - 1; i >= 0; i -= 1) {
    if (playerList[i].score < 0) {
      playerList.splice(i, 1);
    }
  }
};

const removeWinner = (playerList) => {
  for (let i = playerList.length - 1; i >= 0; i -= 1) {
    if (playerList[i].zones[1]) {
      playerList.splice(i, 1);
    }
  }
};

const updatePlayerPosition = (playerList, zoneList) => {
  const dt = 1 / 60;
  playerList.forEach((player) => {
    player.cellList.forEach((cell) => {
      const newVel = new Vector2();
      newVel.set(
        (player.keysDown[39] + player.keysDown[68])
        - player.keysDown[37] - player.keysDown[65],

        (player.keysDown[40] + player.keysDown[83])
        - player.keysDown[38] - player.keysDown[87],
      ).scale(setting.playerVel).clipNorm(setting.playerVel);

      cell.vel.interpolate(newVel, 0.2);

      cell.pos.add(cell.vel.clone().scale(dt));

      /* clip to world boundary */
      const r = cell.getRadius();
      cell.pos.clipComponents(
        r, setting.worldWidth - r,
        r, setting.worldHeight - r,
      );

      /* clip to zone boundaries */
      zoneList.forEach((zone) => {
        zone.doorkeep(player);
      });
    });
  });
};

const updateFoodPosition = (foodList, bulletList) => {
  const dt = 1 / 60;
  foodList.forEach((food) => {
    if (food.vel.norm() !== 0) {
      food.pos.add(food.vel.clone().scale(dt));
    }
  });
  bulletList.forEach((food) => {
    food.pos.add(food.vel.clone().scale(dt));
  });
};

const getZones = (pos, zoneList) => {
  const zones = [];
  zoneList.forEach((zone) => {
    if (zone.contains(pos)) {
      zones[zone.id] = true;
    }
  });
  return zones;
};

const fireFood = (player, foodList, zoneList, bulletList, newFoodList) => {
  const direction = new Vector2();
  direction.subtractVectors(
    player.mousePos,
    player.cellList[0].pos,
  ).normalise();

  const vel = direction.clone().scale(setting.bulletVel);
  const src = player.cellList[0].pos.clone()
    .add(direction.clone().scale(player.cellList[0].getRadius() + 10));

  const newBulletFood = new Food({
    mass: -1 * setting.foodMass,
    pos: src,
    vel,
    zones: getZones(src, zoneList),
    id: uuid(),
    isEaten: false,
  });
  foodList.push(newBulletFood);

  newFoodList.push({
    pos: newBulletFood.pos,
    id: newBulletFood.id,
    color: setting.bulletColor,
  });
  bulletList.push(newBulletFood);

  player.score -= 100;
  player.remainingFireFoodCooldown = player.fireFoodCooldown;
};


const fireFoods = (playerList, foodList, zoneList, bulletList, newFoodList) => {
  playerList.forEach((player) => {
    if (player.remainingFireFoodCooldown > 0) {
      player.remainingFireFoodCooldown -= 1;
    } else if (player.mouseDown && player.score > 200) {
      fireFood(player, foodList, zoneList, bulletList, newFoodList);
    }
  });
};

const generateFoods = (foodList, newFoodList) => {
  /* TODO: don't count the foods that are actually bullets */
  for (let i = 0; i < setting.foodNumber - foodList.length; i += 1) {
    const newFood = new Food({
      mass: setting.foodMass,
      vel: new Vector2(0, 0),
      pos: new Vector2(
        Math.random() * setting.worldWidth,
        Math.random() * setting.worldHeight,
      ),
      id: uuid(),
      isEaten: false,
    });
    foodList.push(newFood);
    newFoodList.push({
      pos: newFood.pos,
      id: newFood.id,
      color: setting.foodColor,
    });
  }
};

const checkOneFoodExpired = (food, zoneList) => {
  /* only bullets move and can possibly expire */
  if (food.mass > 0) { return; }

  if (food.pos.x > setting.worldWidth ||
      food.pos.y > setting.worldHeight ||
      food.pos.x < 0 || food.pos.y < 0) {
    food.isEaten = true;
    return;
  }

  for (let i = 0; i < zoneList.length; i += 1) {
    if (zoneList[i].contains(food.pos)) {
      if (!food.zones[zoneList[i].id]) {
        food.isEaten = true;
        return;
      }
    } else if (food.zones[zoneList[i].id]) {
      food.isEaten = true;
      return;
    }
  }
};

const checkOneFoodEaten = (cell, food) => {
  if (Math.sqrt(((cell.pos.x - food.pos.x) ** 2) +
  ((cell.pos.y - food.pos.y) ** 2)) < cell.getRadius()) {
    food.isEaten = true;
    return true;
  }
  return false;
};

const checkAllFoodEaten = (playerList, foodList, zoneList) => {
  for (let k = 0; k < foodList.length; k += 1) {
    checkOneFoodExpired(foodList[k], zoneList);
    for (let i = 0; i < playerList.length; i += 1) {
      if (playerList[i].score + foodList[k].mass <= setting.playerBulletLimit * 100) {
        if (checkOneFoodEaten(playerList[i].cellList[0], foodList[k])) {
          /* this is potentially confusion: `mass` determines the radius of the
           * cell. Since we don't want the size of the player to change anymore,
           * we keep track of bullet count with `score` instead. */
        //   console.log(`${playerList[i].score}+${foodList[k].mass}`);
          playerList[i].score += foodList[k].mass;
        }
      }
    }
  }
};

const removeEatenFoods = (foodList, isEatenFoodIdList, bulletList) => {
  const isEatenList = [];
  const isEatenBulletIdList = [];
  for (let i = 0; i < foodList.length; i += 1) {
    if (foodList[i].isEaten) {
      isEatenList.push(i);
      isEatenFoodIdList.push(foodList[i].id);
      if (foodList[i].vel.norm() !== 0) {
        isEatenBulletIdList.push(foodList[i].id);
      }
    }
  }
  for (let i = isEatenList.length - 1; i >= 0; i -= 1) {
    foodList.splice(isEatenList[i], 1);
  }
  for (let i = isEatenBulletIdList.length - 1; i >= 0; i -= 1) {
    bulletList.splice(bulletList.findIndex(bullet => bullet.id === isEatenBulletIdList[i].id), 1);
  }
};

export {
  checkAllPlayerDead,
  updatePlayerPosition,
  updateFoodPosition,
  fireFoods,
  generateFoods,
  checkAllFoodEaten,
  removeEatenFoods,
  removeWinner,
};
