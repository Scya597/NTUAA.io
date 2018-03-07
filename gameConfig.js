const setting = {
  worldWidth: 4664,
  worldHeight: 2214,
  zoneOneRadius: 600,
  zoneTwoRadius: 80,
  zoneAccessSeconds: 300,
  zoneAccessLimit: 35,
  playerBulletLimit: 50,
  foodMass: 100,
  foodRadius: 24,
  cellMass: 2400,
  foodNumber: 500,
  bulletVel: 300,
  playerVel: 200,
  foodColor: 0x000000,
  bulletColor: 0xff0000,
};

const socketTask = {
  INIT: 'INIT',
  STATE_UPDATE: 'STATE_UPDATE',
  GET_DATA: 'GET_DATA',
  GET_PLAYERS_DATA: 'GET_PLAYERS_DATA',
  GET_BULLETS_DATA: 'GET_BULLETS_DATA',
  GET_NEW_FOODS_DATA: 'GET_NEW_FOODS_DATA',
  GET_IS_EATEN_FOODS_DATA: 'GET_IS_EATEN_FOODS_DATA',
  GET_ZONE_TIME: 'GET_ZONE_TIME',
  GET_INIT_FOOD_DATA: 'GET_INIT_FOOD_DATA',
  GET_INIT_ZONE_DATA: 'GET_INIT_ZONE_DATA',
  GET_ZONE_DATA: 'GET_ZONE_DATA',
  WIN: 'WIN',
};

export { setting, socketTask };
