import './env';
import express from "express";
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const redisAdapter = require("socket.io-redis");
const redis = require("redis");
const redisClient = redis.createClient({ host: process.env.REDIS_URL, port: process.env.REDIS_PORT });
io.adapter(redisAdapter({ host: process.env.REDIS_URL, port: process.env.REDIS_PORT }));
app.get("/", (req, res, next) => {
  res.send("hello world!");
});

io.on("connection", (socket) => {
  // joinRoom을 클라이언트가 emit 했을 시
  //유저가 방입장시 방id에 따라 우선적으로 조인 시킴
  socket.on("joinRoom", (roomId) => {
    redisClient.lrange(roomId, 0, -1, (err, data) => {
      const datas= []
      data?.forEach(item=>datas.unshift(JSON.parse(item)))
      socket.emit("joinData", datas);
    });
    socket.join(roomId);
  });

  //채팅 메시지 대기후 받으면 방아이디에 대한 emit을 보냄
  socket.on("chatting", (msg) => {
    redisClient.lpush(
      msg.roomId,
      `{"avatar":"${msg.avatar}","name":"${msg.name}","msg":"${msg.msg}","id":"${msg.id}"}`
    );
  console.log(msg)
    io.to(msg.roomId).emit("message", msg);
  });
});

http.listen(process.env.PORT, () => {
  console.log(`localhost:${process.env.PORT}`);
});

// $env:NODE_ENV="dev"; yarn dev
