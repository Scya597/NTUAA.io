const setting = {
  worldWidth: 11660,
  worldHeight: 5536,
  zoneOneRadius: 1500,
  zoneTwoRadius: 200,
  zoneAccessSeconds: 200,
  zoneAccessLimit: 15,
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
