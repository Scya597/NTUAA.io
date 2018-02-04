import uuid from 'uuid/v1';

import Food from './entity/food';
import Vector2 from './space/vector2';

const updatePlayerPosition = (playerList, zoneList, setting) => {
  const dt = 1 / 60;
  playerList.forEach((player) => {
    player.cellList.forEach((cell) => {
      const newVel = new Vector2();
      newVel.set(
        player.keysDown[39] + player.keysDown[68]
        - player.keysDown[37] - player.keysDown[65],

        player.keysDown[40] + player.keysDown[83]
        - player.keysDown[38] - player.keysDown[87]
      ).scale(500).clipNorm(500);

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

const updateFoodPosition = (foodList) => {
  const dt = 1 / 60;
  foodList.forEach((food) => {
    food.pos.add(food.vel);
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

const fireFood = (player, foodList, zoneList) => {
  const direction = new Vector2();
  direction.subtractVectors(
    player.mousePos,
    player.cellList[0].pos,
  ).normalise();

  const vel = direction.clone().scale(10);
  const src = player.cellList[0].pos.clone()
    .add(direction.clone().scale(player.cellList[0].getRadius() + 10));

  foodList.push(new Food({
    mass: -100,
    pos: src,
    vel,
    zones: getZones(src, zoneList),
    id: uuid(),
    color: 0x111111,
    isEaten: false,
  }));

  player.score -= 100;
  player.remainingFireFoodCooldown = player.fireFoodCooldown;
};


const fireFoods = (playerList, foodList, zoneList) => {
  playerList.forEach((player) => {
    if (player.remainingFireFoodCooldown > 0) {
      player.remainingFireFoodCooldown -= 1;
    } else if (player.mouseDown && player.score > 200) {
      fireFood(player, foodList, zoneList);
    }
  });
};

const generateFoods = (foodList, setting) => {
  /* TODO: don't count the foods that are actually bullets */
  for (let i = 0; i < 400 - foodList.length; i += 1) {
    foodList.push(new Food({
      mass: 100,
      vel: new Vector2(0, 0),
      pos: new Vector2(
        Math.random() * setting.worldWidth,
        Math.random() * setting.worldHeight,
      ),
      id: uuid(),
      color: 0x111111,
      isEaten: false,
    }));
  }
};

const checkOneFoodExpired = (food, zoneList, setting) => {
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
};

const checkAllFoodEaten = (playerList, foodList, zoneList, setting) => {
  for (let k = 0; k < foodList.length; k += 1) {
    checkOneFoodExpired(foodList[k], zoneList, setting);

    for (let i = 0; i < playerList.length; i += 1) {
      if (checkOneFoodEaten(playerList[i].cellList[0], foodList[k])) {
        /* this is potentially confusion: `mass` determines the radius of the
         * cell. Since we don't want the size of the player to change anymore,
         * we keep track of bullet count with `score` instead. */
        console.log(`${playerList[i].score}+${foodList[k].mass}`);
        playerList[i].score += foodList[k].mass;
      }
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
  updateFoodPosition,
  fireFoods,
  generateFoods,
  checkAllFoodEaten,
  removeEatenFoods,
};
