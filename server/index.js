const express = require('express');
const { Server } = require('colyseus');
const GameRoom = require('./rooms/GameRoom');

const PORT = 3000;
const app = express();

const gameServer = new Server();
gameServer.define('game_room', GameRoom);

gameServer.listen(PORT);
console.log(`Game server running on ws://localhost:${PORT}`);