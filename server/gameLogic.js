import {
  updateFoodPosition,
  updatePlayerPosition,
  updatePlayersBoxValue,
  fireFood,
  checkAllEaten, removeEatenCells, generateFoods,
  checkAllFoodEaten, removeEatenFoods } from './physicsEngine';
import Vector2 from './space/vector2';
import Zone from './space/zone';
import Player from './entity/player';
import setting from '../src/game/config';

export default function ioActivate(io) {
  const userList = [];
  const playerList = [];
  const foodList = [];
  const zoneList = [
    new Zone({
      acceptEntry: function(player) {
        return player.score > 200;
      },
      cooldown: 0,
      centre: new Vector2(0, 0),
      radius: 500,

      id: 0,

      /* unused */
      color: 0xff0000,
    }),

    new Zone({
      acceptEntry: function(player) {
        return true;
      },
      cooldown: 10*1000,
      centre: new Vector2(0, 0),
      radius: 300,

      id: 1,

      /* unused */
      color: 0xff0000,
    })
  ];

  io.on('connection', (socket) => {
    console.log('New client connected');
    // login
    socket.emit('GET_USERLIST', userList);

    socket.on('SET_NAME', (userInfo) => {
      userList.push({ name: userInfo.name, id: userInfo.id });
      console.log('socket on SET_NAME userList:', userList);
      io.emit('GET_USERLIST', userList);
    });
    // pixi
    socket.on('INIT', (player) => {
      const newPlayer = new Player({ id: player.id, name: player.name });
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
        player.keysDown = mouseData.keysDown;
      }
    });

    socket.on('GET_DATA', () => {
      socket.emit('GET_PLAYERS_DATA', playerList);
      socket.emit('GET_FOODS_DATA', foodList);
      socket.emit('GET_ZONE_DATA', zoneList);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      userList.splice(userList.findIndex(user => user.id === socket.handshake.query.id), 1);
      playerList.splice(playerList.findIndex(player => player.id === socket.handshake.query.id), 1);
      io.emit('GET_USERLIST', userList);
    });
  });

  setInterval(() => {
    updatePlayerPosition(playerList, zoneList, setting);
    updateFoodPosition(foodList, zoneList, setting);
    generateFoods(foodList, setting);
    checkAllFoodEaten(playerList, foodList, zoneList, setting);
    removeEatenFoods(foodList);
  }, 1000 / 60);

  setInterval(() => {
    if (playerList[0]) {
      fireFood(playerList[0], foodList, zoneList);
    }
  }, 1000);

}

// PRESS_SPACE
