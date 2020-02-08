import events from "./events";
import { chooseWords } from "./words";

let sockets = [];
let inProgress = false;
let word = null;
let leader = null;

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
      }, 3000);
    }
  };

  const endGame = () => {
    inProgress = false;
    superBroadcast(events.gameEnded);
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
    if (sockets.length === 2) {
      startGame();
    }
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
        nickname: "Bot"
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
};

export default socketController;
