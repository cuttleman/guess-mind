import events from "./events";
import { chooseWords } from "./words";

let sockets = [];
let playerReady = [];
let inProgress = false;
let word = null;
let leader = null;
let BOT = "bot";

const chooseLeader = () => sockets[Math.floor(Math.random() * sockets.length)];

const socketController = (socket, io) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  const superBroadcast = (event, data) => io.emit(event, data);
  const sendUpdatePlayer = () =>
    superBroadcast(events.updatePlayer, { sockets });

  const startGame = () => {
    if (inProgress === false) {
      inProgress = true;
      leader = chooseLeader();
      word = chooseWords();
      superBroadcast(events.gameStarting);
      setTimeout(() => {
        superBroadcast(events.gameStarted);
        io.to(leader.id).emit(events.leaderNotifi, { word });
        superBroadcast(events.readyBtnLock);
        io.to(leader.id).emit(events.leaderShotClock);
      }, 3000);
    }
  };

  const endGame = () => {
    inProgress = false;
    playerReady = [];
    superBroadcast(events.gameEnded);
    superBroadcast(events.unLock);
  };

  const addPointer = id => {
    sockets = sockets.map(socket => {
      if (socket.id === id) {
        socket.point += 10;
      }
      return socket;
    });
    sendUpdatePlayer();
    endGame();
  };

  socket.on(events.setNickname, ({ nickname }) => {
    broadcast(events.newUser, { nickname });
    socket.nickname = nickname;
    sockets.push({ id: socket.id, point: 0, nickname: socket.nickname });
    sendUpdatePlayer();
  });

  socket.on(events.disconnect, () => {
    broadcast(events.disconnected, { nickname: socket.nickname });
    sockets = sockets.filter(aSocket => aSocket.id !== socket.id);
    sendUpdatePlayer();
    if (sockets.length === 1) {
      endGame();
    } else if (leader) {
      if (socket.id === leader.id) {
        endGame();
      }
    }
  });

  socket.on(events.sendMsg, ({ message }) => {
    broadcast(events.newMsg, { nickname: socket.nickname, message });
    if (word === message) {
      superBroadcast(events.newMsg, {
        message: `${socket.nickname} WIN!!`,
        nickname: BOT
      });
      addPointer(socket.id);
    }
  });

  socket.on(events.beginPath, ({ x, y }) => {
    broadcast(events.beganPath, { x, y });
  });

  socket.on(events.strokePath, ({ x, y, color }) => {
    broadcast(events.strokedPath, { x, y, color });
  });

  socket.on(events.fill, ({ color }) => {
    broadcast(events.filled, { color });
  });

  socket.on(events.ready, ({ ready }) => {
    playerReady.push(ready);
    superBroadcast(events.newMsg, {
      message: `${socket.nickname} 준비됐대`,
      nickname: BOT
    });
    if (playerReady.length === 2) {
      startGame();
    }
  });

  socket.on(events.unready, ({ ready }) => {
    playerReady.pop(ready);
    superBroadcast(events.newMsg, {
      message: `${socket.nickname} 준비취소했어`,
      nickname: BOT
    });
    if (playerReady.length !== 2) {
      endGame();
    }
  });
  socket.on(events.via, ({ num }) => {
    broadcast(events.normalShotClock, { num });
  });

  socket.on(events.timeOut, () => {
    superBroadcast(events.newMsg, {
      message: `${leader.nickname} WIN!!`,
      nickname: BOT
    });
    addPointer(leader.id);
  });
  // setInterval(() => console.log(playerReady.length), 3000);
};

export default socketController;
