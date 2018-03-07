const setting = {
  worldWidth: 11660,
  worldHeight: 5536,
  zoneOneRadius: 1500,
  zoneTwoRadius: 200,
  zoneAccessSeconds: 300,
  zoneAccessLimit: 35,
  playerBulletLimit: 50,
  foodMass: 100,
  cellMass: 10000,
  foodNumber: 500,
  bulletVel: 850,
  playerVel: 500,
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
