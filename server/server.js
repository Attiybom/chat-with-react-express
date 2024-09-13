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
};

const stopTimer = () => {
  if (timer && clientsCount === 0) {
    clearInterval(timer);
    timer = null;
  }
};

io.on("connection", (socket) => {
  // 连接成功
  console.log(`a user:${socket.id} connected`);

  // 加入房间
  socket.on("join_room", (room) => {
    console.log(`user:${socket.id} joined room ${room}`);
    socket.join(room);
  });

  // 接收消息
  socket.on("new_message", (data) => {
    // console.log("New message received ", data);
    // 广播给除自己之外的所有用户
    // socket.broadcast.emit(`Message-Received`, data)

    const { message, room } = data;
    io.to(room).emit("Message-Received", { message });
  });

  // 数字定时器
  startTimer();

  // 断开连接时候，清除数字定时器
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
