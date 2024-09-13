import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `http://localhost:5173`,
    methods: ["GET", "POST"],
  },
});

let timer;
let clientsCount = 0;

const startTimer = () => {
  if (!timer) {
    timer = setInterval(() => {
      const count = Math.floor(Math.random() * 100) + 1;
      io.emit("message_response", { count });
    }, 2000);
  }
}

const stopTimer = () => {
  if (timer && clientsCount === 0) {
    clearInterval(timer);
    timer = null;
  }
 }

io.on("connection", (socket) => {
  // 连接成功
  console.log(`a user:${socket.id} connected`);

  // 接收消息
  socket.on("new_message", (data) => {
    console.log("New message received ", data);
  });

  startTimer();


  // 清除定时器
  socket.on("disconnect", () => {
    console.log(`user:${socket.id} disconnected`);
    clientsCount--;
    stopTimer();
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
