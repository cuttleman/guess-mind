"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = _interopRequireDefault(require("./events"));

var _words = require("./words");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sockets = [];
var playerReady = [];
var inProgress = false;
var word = null;
var leader = null;
var BOT = "bot";

var chooseLeader = function chooseLeader() {
  return sockets[Math.floor(Math.random() * sockets.length)];
};

var socketController = function socketController(socket, io) {
  var broadcast = function broadcast(event, data) {
    return socket.broadcast.emit(event, data);
  };

  var superBroadcast = function superBroadcast(event, data) {
    return io.emit(event, data);
  };

  var sendUpdatePlayer = function sendUpdatePlayer() {
    return superBroadcast(_events["default"].updatePlayer, {
      sockets: sockets
    });
  };

  var startGame = function startGame() {
    if (inProgress === false) {
      inProgress = true;
      leader = chooseLeader();
      word = (0, _words.chooseWords)();
      superBroadcast(_events["default"].gameStarting);
      setTimeout(function () {
        superBroadcast(_events["default"].gameStarted);
        io.to(leader.id).emit(_events["default"].leaderNotifi, {
          word: word
        });
        superBroadcast(_events["default"].readyBtnLock);
        io.to(leader.id).emit(_events["default"].leaderShotClock);
      }, 3000);
    }
  };

  var endGame = function endGame() {
    inProgress = false;
    playerReady = [];
    superBroadcast(_events["default"].gameEnded);
    superBroadcast(_events["default"].unLock);
  };

  var addPointer = function addPointer(id) {
    sockets = sockets.map(function (socket) {
      if (socket.id === id) {
        socket.point += 10;
      }

      return socket;
    });
    sendUpdatePlayer();
    endGame();
  };

  socket.on(_events["default"].setNickname, function (_ref) {
    var nickname = _ref.nickname;
    socket.nickname = nickname;
    sockets.push({
      id: socket.id,
      point: 0,
      nickname: socket.nickname
    });

    if (sockets.length < 4) {
      broadcast(_events["default"].newUser, {
        nickname: nickname
      });
    } else if (sockets.length >= 4) {
      sockets.pop();
      socket.emit(_events["default"].goAway);
    }

    sendUpdatePlayer();
  });
  socket.on(_events["default"].disconnect, function () {
    broadcast(_events["default"].disconnected, {
      nickname: socket.nickname
    });
    sockets = sockets.filter(function (aSocket) {
      return aSocket.id !== socket.id;
    });
    sendUpdatePlayer();

    if (sockets.length === 1) {
      endGame();
    } else if (leader) {
      if (socket.id === leader.id) {
        endGame();
      }
    }
  });
  socket.on(_events["default"].sendMsg, function (_ref2) {
    var message = _ref2.message;
    broadcast(_events["default"].newMsg, {
      nickname: socket.nickname,
      message: message
    });

    if (word === message) {
      superBroadcast(_events["default"].newMsg, {
        message: "Winner ".concat(socket.nickname),
        nickname: BOT
      });
      addPointer(socket.id);
      endGame();
    }
  });
  socket.on(_events["default"].beginPath, function (_ref3) {
    var x = _ref3.x,
        y = _ref3.y;
    broadcast(_events["default"].beganPath, {
      x: x,
      y: y
    });
  });
  socket.on(_events["default"].strokePath, function (_ref4) {
    var x = _ref4.x,
        y = _ref4.y,
        color = _ref4.color;
    broadcast(_events["default"].strokedPath, {
      x: x,
      y: y,
      color: color
    });
  });
  socket.on(_events["default"].fill, function (_ref5) {
    var color = _ref5.color;
    broadcast(_events["default"].filled, {
      color: color
    });
  });
  socket.on(_events["default"].ready, function (_ref6) {
    var ready = _ref6.ready;
    playerReady.push(ready);
    superBroadcast(_events["default"].newMsg, {
      message: "".concat(socket.nickname, " Ready"),
      nickname: BOT
    });

    if (sockets.length === 2) {
      if (playerReady.length === 2) {
        startGame();
      }
    } else if (sockets.length === 3) {
      if (playerReady.length === 3) {
        startGame();
      }
    }
  });
  socket.on(_events["default"].unready, function (_ref7) {
    var ready = _ref7.ready;
    playerReady.pop(ready);
    superBroadcast(_events["default"].newMsg, {
      message: "".concat(socket.nickname, " Unready"),
      nickname: BOT
    });

    if (playerReady.length !== 2) {
      endGame();
    }
  });
  socket.on(_events["default"].via, function (_ref8) {
    var num = _ref8.num,
        warnning = _ref8.warnning;
    broadcast(_events["default"].normalShotClock, {
      num: num,
      warnning: warnning
    });

    if (num === 0) {
      endGame();
      superBroadcast(_events["default"].newMsg, {
        message: "Winner ".concat(leader.nickname),
        nickname: BOT
      });
      addPointer(leader.id);
    }
  });
};

var _default = socketController;
exports["default"] = _default;