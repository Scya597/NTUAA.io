import {
  checkAllPlayerDead,
  updateFoodPosition,
  updatePlayerPosition,
  fireFoods, generateFoods,
  checkAllFoodEaten, removeEatenFoods, removeWinner } from './physicsEngine';
import Vector2 from './space/vector2';
import Zone from './space/zone';
import Player from './entity/player';
import setting from '../gameConfig';

export default function ioActivate(io) {
  const userList = [];
  const playerList = [];
  const foodList = [];

  let isEatenFoodIdList = [];
  let newFoodList = [];
  let bulletList = [];

  const zoneList = [
    new Zone({
      acceptEntry(player) {
        return player.score >= setting.zoneAccessLimit * 100;
      },
      cooldown: 0,
      centre: new Vector2(setting.worldWidth / 2, setting.worldHeight / 2),
      radius: setting.zoneOneRadius,
      id: 0,

      /* unused */
      color: 0x696969,
    }),

    new Zone({
      acceptEntry() {
        return true;
      },
      cooldown: setting.zoneAccessSeconds * 1000,
      centre: new Vector2(setting.worldWidth / 2, setting.worldHeight / 2),
      radius: setting.zoneTwoRadius,

      id: 1,

      /* unused */
      color: 0xffff00,
    }),
  ];

  io.on('connection', (socket) => {
    console.log('New client connected');
    // login
    socket.on('EMIT_USERLIST', () => {
      io.emit('GET_USERLIST', userList);
    });

    socket.on('SET_NAME', (userInfo) => {
      userList.push({ name: userInfo.name, id: userInfo.id });
      io.emit('GET_USERLIST', userList);
    });
    // pixi
    socket.on('INIT', (player) => {
      const newPlayer = new Player({
        id: player.id,
        name: player.name,
        character: player.character,
      });
      playerList.push(newPlayer);
    });

    socket.on('STATE_UPDATE', (mouseData) => {
      const player = playerList.find((element) => {
        if (element.id === mouseData.id) {
          return element;
        }
        return false;
      });
      if (player) {
        player.mousePos = mouseData.mousePos;
        player.mouseDown = mouseData.mouseDown;
        player.keysDown = mouseData.keysDown;
      }
    });

    socket.on('GET_DATA', () => {
      socket.emit('GET_PLAYERS_DATA', playerList);
      socket.emit('GET_BULLETS_DATA', bulletList);

      io.emit('GET_NEW_FOODS_DATA', newFoodList);
      newFoodList.length = 0;

      io.emit('GET_IS_EATEN_FOODS_DATA', isEatenFoodIdList);
      isEatenFoodIdList.length = 0;

      socket.emit('GET_ZONE_TIME', zoneList[1].remainTime);
    });

    socket.on('GET_INIT_FOOD_DATA', () => {
      socket.emit('GET_NEW_FOODS_DATA', foodList);
    });

    socket.on('GET_INIT_ZONE_DATA', () => {
      socket.emit('GET_ZONE_DATA', zoneList);
    });

    socket.on('WIN', () => {
      console.log('win');
      removeWinner(playerList, userList);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      if (userList.findIndex(user => user.id === socket.handshake.query.id) !== -1) {
        userList.splice(userList.findIndex(user => user.id === socket.handshake.query.id), 1);
        playerList.splice(playerList.findIndex(player =>
          player.id === socket.handshake.query.id), 1);
        io.emit('GET_USERLIST', userList);
      }
    });
  });

  setInterval(() => {
    checkAllPlayerDead(playerList, userList);
    updatePlayerPosition(playerList, zoneList, setting);
    updateFoodPosition(foodList, bulletList);
    fireFoods(playerList, foodList, zoneList, bulletList, newFoodList);
    generateFoods(foodList, newFoodList, setting);
    checkAllFoodEaten(playerList, foodList, zoneList, setting);
    removeEatenFoods(foodList, isEatenFoodIdList, bulletList);
    zoneList[1].remainTime = zoneList[1].getRemainingCooldownTime();
    console.log(newFoodList.length);
    console.log(isEatenFoodIdList.length);
    console.log(bulletList.length);
  }, 1000 / 60);

  /*
  setInterval(() => {
    if (playerList[0]) {
      fireFood(playerList[0], foodList, zoneList);
    }
  }, 1000);
  */
}

// PRESS_SPACE
