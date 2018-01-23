import { updatePlayerPosition, updatePlayersBoxValue,
  checkAllEaten, removeEatenCells, generateFoods,
  checkAllFoodEaten, removeEatenFoods } from './physicsEngine';
import Player from './entity/player';
import setting from '../src/game/config';

export default function ioActivate(io) {
  const userList = [];
  const playerList = [];
  const foodList = [];

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

    socket.on('MOUSE_MOVE', (mouseData) => {
      const player = playerList.find((element) => {
        if (element.id === mouseData.id) {
          return element;
        }
        return false;
      });
      if (player) {
        player.mousePos = mouseData.mousePos;
      }
    });

    socket.on('GET_DATA', () => {
      socket.emit('GET_PLAYERS_DATA', playerList);
      socket.emit('GET_FOODS_DATA', foodList);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      userList.splice(userList.findIndex(user => user.id === socket.handshake.query.id), 1);
      playerList.splice(playerList.findIndex(player => player.id === socket.handshake.query.id), 1);
      io.emit('GET_USERLIST', userList);
    });
  });

  setInterval(() => {
    updatePlayerPosition(playerList, setting);
    generateFoods(foodList, setting);
    checkAllFoodEaten(playerList, foodList);
    removeEatenFoods(foodList);
  }, 1000 / 60);
}

// PRESS_SPACE
