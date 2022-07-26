import express from "express";
const app = express();
import http from "http";
import { Server } from "socket.io";
import Game from "./models/game.js";

import { dirname } from "path";
import { fileURLToPath } from "url";

const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
app.use(express.static(dirname(__filename)));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

let availableRooms = [];
let players = [];
const games = {};
let playerName1 = "andreea";
let playerName2 = "ioana"

const emitMenuData = () => {
  console.log(`This Are the players ${players}`)
  io.to("menu").emit("data", {
    room: "menu",
    availableRooms, 
    players
  });
};

const emitRoomData = (roomName) => {
  io.to(roomName).emit("data", { room: games[roomName].data() });
  console.log(games[roomName].data())
};

io.on("connection", (socket) => {
  console.log(`[SOCKET CONNECTED] ${socket.id}`);

  socket.data.name = socket.id;

  socket.emit("connected", socket.id);
  socket.join("menu");

  emitMenuData();

  socket.on("new-message", (message) => {
    io.to(socket.data.room).emit("received-message", message);
  });

  socket.on("create-room", (roomName) => {
    if (availableRooms.indexOf(roomName) === -1 && roomName !== "menu") {
      console.log("[CREATED ROOM] " + roomName);
      availableRooms.push(roomName);
      games[roomName] = new Game(roomName, socket.id, players[socket.id]);
      socket.data.room = roomName;
      socket.leave("menu");
      socket.join(roomName);
      emitRoomData(roomName);
      emitMenuData();
    } else {
      socket.emit("create-room-error");
    }
  });

  socket.on("add-player-name", (playerName) => {
    players[socket.id] = playerName;
    console.log(players)
    emitMenuData()
  })

  socket.on("join-room", (roomName) => {
    socket.leave("menu");
    games[roomName].addPlayer(socket.id, players[socket.id]);
    socket.join(roomName);
    socket.data.room = roomName;
    availableRooms = availableRooms.filter((room) => room !== roomName);
    emitRoomData(roomName);
    emitMenuData();
  });

  socket.on("game-action", ({ action, circleId }) => {
    console.log({ action, circleId });
    const game = games[socket.data.room];
    game.action(socket.id, action, circleId);
    emitRoomData(socket.data.room);
  });

  socket.on("leave-room", () => {
    socket.leave(socket.data.room);
    socket.join("menu");

    emitMenuData();
  });

  socket.on("disconnect", () => {
    console.log("[SOCKET DISCONNECTED] " + socket.id);
    io.to(socket.data.room).emit("data", {
      room: {
        name: socket.data.room,
        mustLeave: true,
        message: "The other player left. Please leave the room...",
      },
    });
  });
});
