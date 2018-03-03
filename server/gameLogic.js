import {
  checkAllPlayerDead,
  updateFoodPosition,
  updatePlayerPosition,
  fireFoods, generateFoods,
  checkAllFoodEaten, removeEatenFoods, removeWinner } from './physicsEngine';
import Vector2 from './space/vector2';
import Zone from './space/zone';
import Player from './entity/player';
import { setting, socketTask as task } from '../gameConfig';

export default function ioActivate(io) {
  const playerList = [];
  const foodList = [];

  const isEatenFoodIdList = [];
  const newFoodList = [];
  const bulletList = [];

  const zoneList = [
    new Zone({
      acceptEntry(player) {
        return player.score >= setting.zoneAccessLimit * 100;
      },
      cooldown: 0,
      centre: new Vector2(setting.worldWidth / 2, setting.worldHeight / 2),
      radius: setting.zoneOneRadius,
      id: 0,
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
      color: 0xffff00,
    }),
  ];

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on(task.INIT, (player) => {
      console.log('INIT');
      const newPlayer = new Player({
        id: player.id,
        name: player.name,
        character: player.character,
      });
      playerList.push(newPlayer);
    });

    socket.on(task.STATE_UPDATE, (mouseData) => {
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

    socket.on(task.GET_DATA, () => {
      socket.emit(task.GET_PLAYERS_DATA, playerList);
      socket.emit(task.GET_BULLETS_DATA, bulletList);

      io.emit(task.GET_NEW_FOODS_DATA, newFoodList);
      newFoodList.length = 0;

      io.emit(task.GET_IS_EATEN_FOODS_DATA, isEatenFoodIdList);
      isEatenFoodIdList.length = 0;

      socket.emit(task.GET_ZONE_TIME, zoneList[1].remainTime);
    });

    socket.on(task.GET_INIT_FOOD_DATA, () => {
      socket.emit(task.GET_NEW_FOODS_DATA, foodList);
    });

    socket.on(task.GET_INIT_ZONE_DATA, () => {
      socket.emit(task.GET_ZONE_DATA, zoneList);
    });

    socket.on(task.WIN, () => {
      console.log('WIN');
      removeWinner(playerList);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');

      if (playerList.findIndex(player => player.id === socket.handshake.query.id) !== -1) {
        playerList.splice(playerList.findIndex(player =>
          player.id === socket.handshake.query.id), 1);
      }
    });
  });

  setInterval(() => {
    checkAllPlayerDead(playerList);
    updatePlayerPosition(playerList, zoneList);
    updateFoodPosition(foodList, bulletList);
    fireFoods(playerList, foodList, zoneList, bulletList, newFoodList);
    generateFoods(foodList, newFoodList);
    checkAllFoodEaten(playerList, foodList, zoneList);
    removeEatenFoods(foodList, isEatenFoodIdList, bulletList);
    zoneList[1].remainTime = zoneList[1].getRemainingCooldownTime();
  }, 1000 / 60);
}
