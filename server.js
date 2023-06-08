const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {

  socket.on("joinRoom", (username, roomCode) => {
    socket.join(roomCode);
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (room && room.size === 2) {
      io.to(roomCode).emit("startGame");
    }
  });

  socket.on("play", ({ id, currentPlayer, roomCode, board }) => {
    socket.broadcast.to(roomCode).emit("updateGame", { id, currentPlayer, board });
  });

  socket.on("winGame", ({ winner, roomCode }) => {
    io.to(roomCode).emit("winGame", { winner });
  });

  socket.on("drawGame", ({ roomCode }) => {
    io.to(roomCode).emit("drawGame");
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log("Server Running")
);
