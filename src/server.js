import express from 'express'
const app = express();
const port = 3814;
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: '172.16.2.118', port: 6379 }));
app.get('/', (req, res, next) => {
    res.send('hello world!');
});

io.on('connection',(socket) => {
    // joinRoom을 클라이언트가 emit 했을 시
    //유저가 방입장시 방id에 따라 우선적으로 조인 시킴
    socket.on('joinRoom',async function(msg) {  
        console.log(msg)
        let roomId = msg;
        socket.join(roomId);  
    });

    //채팅 메시지 대기후 받으면 방아이디에 대한 emit을 보냄
    socket.on('chatting',async (msg) => {
        console.log(msg)
        
        io.to(msg.roomId).emit("room1",msg.msg)

      });
  });

http.listen(port, () => {
    console.log(`localhost:${port}`);
});

// $env:NODE_ENV="dev"; yarn dev