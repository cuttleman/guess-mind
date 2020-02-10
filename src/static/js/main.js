(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableChat = exports.disableChat = exports.handleNewMsg = void 0;

var _sockets = require("./sockets");

var messages = document.getElementById("jsMessages");
var sendMsg = document.getElementById("jsSendMsg");
var sendMsgInput = sendMsg.querySelector("input");

var scrollAuto = function scrollAuto() {
  return messages.scrollTop = messages.scrollHeight;
};

var appendMsg = function appendMsg(text, nickname) {
  var li = document.createElement("li");
  li.className = "author ".concat(nickname ? nickname === "bot" ? nickname : "out" : "self");
  li.innerHTML = "<span>".concat(nickname ? nickname !== "bot" ? nickname : "" : "", " ").concat(text, "</span>");
  messages.appendChild(li);
  scrollAuto();
};

var handleSendMsg = function handleSendMsg(e) {
  e.preventDefault();
  var input = sendMsg.querySelector("input");
  var value = input.value;
  var _window = window,
      events = _window.events;
  (0, _sockets.getSocket)().emit(events.sendMsg, {
    message: value
  });
  input.value = "";
  appendMsg(value);
};

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}

var handleNewMsg = function handleNewMsg(_ref) {
  var message = _ref.message,
      nickname = _ref.nickname;
  return appendMsg(message, nickname);
};

exports.handleNewMsg = handleNewMsg;

var disableChat = function disableChat() {
  sendMsg.style.pointerEvents = "none";
  sendMsgInput.placeholder = "LOCK";
};

exports.disableChat = disableChat;

var enableChat = function enableChat() {
  sendMsg.style.pointerEvents = "initial";
  sendMsgInput.placeholder = "Please enter a message";
};

exports.enableChat = enableChat;

},{"./sockets":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleGoAway = void 0;
var body = document.querySelector("body");
var loginForm = document.getElementById("jsLoginForm");
var input = loginForm.querySelector("input");
var LOGGED_OUT = "loggedOut";
var LOGGED_IN = "loggedIn";
var NICKNAME = "nickname";
var nickName = localStorage.getItem(NICKNAME);

var login = function login(nickname) {
  // eslint-disable-next-line no-undef
  var socket = io("/");
  socket.emit(window.events.setNickname, {
    nickname: nickname
  });
};

var handleGoAway = function handleGoAway() {
  localStorage.removeItem(NICKNAME);
  alert("User is full😥");
  setTimeout(function () {
    return location.reload();
  }, 100);
};

exports.handleGoAway = handleGoAway;

var handleLogin = function handleLogin(e) {
  e.preventDefault();
  var value = input.value;
  input.value = "";
  localStorage.setItem(NICKNAME, value);
  body.className = LOGGED_IN;
  login(value);
};

if (nickName === null) {
  body.className = LOGGED_OUT;
} else {
  body.className = LOGGED_IN;
  login(nickName);
}

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

},{}],3:[function(require,module,exports){
"use strict";

require("./sockets");

require("./login");

require("./notifications");

require("./chat");

require("./paint");

},{"./chat":1,"./login":2,"./notifications":4,"./paint":5,"./sockets":7}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleDisconnect = exports.handleNewUser = void 0;
var notifications = document.getElementById("jsNotifications");

var fireNotification = function fireNotification(text, name) {
  var notification = document.createElement("div");
  notification.innerHTML = text;
  notification.className = name;
  notifications.appendChild(notification);
};

var handleNewUser = function handleNewUser(_ref) {
  var nickname = _ref.nickname;
  return fireNotification("".concat(nickname, " joined!"), "logged join");
};

exports.handleNewUser = handleNewUser;

var handleDisconnect = function handleDisconnect(_ref2) {
  var nickname = _ref2.nickname;
  return fireNotification("".concat(nickname, " logOut!"), "logged leave");
};

exports.handleDisconnect = handleDisconnect;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableCanvas = exports.disableCanvas = exports.handleFilled = exports.handleStrokedPath = exports.handleBeganPath = void 0;

var _sockets = require("./sockets");

var canvas = document.getElementById("jsCanvas");
var ctx = canvas.getContext("2d");
var colors = document.getElementsByClassName("jsColor");
var range = document.getElementById("jsRange");
var mode = document.getElementById("jsMode");
var save = document.getElementById("jsSave");
var CANVAS_W_SIZE = 400;
var CANVAS_H_SIZE = 500;
var INITIAL_COLOR = "#2c2c2c";
canvas.width = CANVAS_W_SIZE;
canvas.height = CANVAS_H_SIZE;
/*pixel modifier*/

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_W_SIZE, CANVAS_H_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;
var painting = false;
var filling = false;

function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
}

var beginPath = function beginPath(x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y);
};

var strokePath = function strokePath(x, y) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var currentColor = ctx.strokeStyle;

  if (color !== null) {
    ctx.strokeStyle = color;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.strokeStyle = currentColor;
};

function onMouseMove(event) {
  var x = event.offsetX;
  var y = event.offsetY;

  if (!painting) {
    beginPath(x, y);
    (0, _sockets.getSocket)().emit(window.events.beginPath, {
      x: x,
      y: y
    });
  } else {
    strokePath(x, y);
    (0, _sockets.getSocket)().emit(window.events.strokePath, {
      x: x,
      y: y,
      color: ctx.strokeStyle
    });
  }
}

function handleRangeChange(event) {
  var strokeSize = event.target.value;
  ctx.lineWidth = strokeSize;
}

function handleColorClick(event) {
  var color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function fill() {
  var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var currentColor = ctx.fillStyle;

  if (color !== null) {
    ctx.fillStyle = color;
  }

  ctx.fillRect(0, 0, CANVAS_W_SIZE, CANVAS_H_SIZE);
  ctx.fillStyle = currentColor;
}

function handleFillCanvas() {
  if (filling) {
    fill();
    (0, _sockets.getSocket)().emit(window.events.fill, {
      color: ctx.fillStyle
    });
  }
}

function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "paint";
  }
}

function handleCM(event) {
  event.preventDefault();
}

function handleSaveBtn() {
  var image = canvas.toDataURL();
  var link = document.createElement("a");
  link.href = image;
  link.download = "junint[🎨]";
  link.click();
}

Array.from(colors).forEach(function (color) {
  return color.addEventListener("click", handleColorClick);
});

if (range) {
  range.addEventListener("input", handleRangeChange);
}

if (mode) {
  mode.addEventListener("click", handleModeClick);
}

if (save) {
  save.addEventListener("click", handleSaveBtn);
}

var handleBeganPath = function handleBeganPath(_ref) {
  var x = _ref.x,
      y = _ref.y;
  beginPath(x, y);
};

exports.handleBeganPath = handleBeganPath;

var handleStrokedPath = function handleStrokedPath(_ref2) {
  var x = _ref2.x,
      y = _ref2.y,
      color = _ref2.color;
  strokePath(x, y, color);
};

exports.handleStrokedPath = handleStrokedPath;

var handleFilled = function handleFilled(_ref3) {
  var color = _ref3.color;
  fill(color);
};

exports.handleFilled = handleFilled;

var disableCanvas = function disableCanvas() {
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("mousedown", startPainting);
  canvas.removeEventListener("mouseup", stopPainting);
  canvas.removeEventListener("mouseleave", stopPainting);
  canvas.removeEventListener("click", handleFillCanvas);
};

exports.disableCanvas = disableCanvas;

var enableCanvas = function enableCanvas() {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleFillCanvas);
};

exports.enableCanvas = enableCanvas;

if (canvas) {
  canvas.addEventListener("contextmenu", handleCM);
}

},{"./sockets":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleUnLock = exports.handlereadyBtnLock = exports.handleGameStarting = exports.handleLeaderNotifi = exports.handleGameEnded = exports.handleGameStarted = exports.handleUpdatePlayer = exports.handleNormalShotClock = exports.handleLeaderShotClock = void 0;

var _paint = require("./paint");

var _chat = require("./chat");

var _sockets = require("./sockets");

var playerBoard = document.getElementById("jsPBoard");
var words = document.getElementById("jsWords");
var readyBtn = document.getElementById("jsPReady");
var clock = document.getElementById("jsPClock");
var timer = clock.querySelector("span");
var GREY = "#95a5a6";
var TPRENT = "transparent";
var GREEN = "#2ecc71";
var WHITE = "white";
var LOCK = "#485460";
var readyClick = false;
var num = 30;

var readyBtnChange = function readyBtnChange(bgColor, font, border) {
  readyBtn.style.backgroundColor = bgColor;
  readyBtn.style.color = font;
  readyBtn.style.borderColor = border;
};

var addPlayer = function addPlayer(players) {
  playerBoard.innerHTML = "";
  players.forEach(function (player) {
    var playerEl = document.createElement("span");
    playerEl.innerText = "".concat(player.nickname, " : ").concat(player.point);
    playerBoard.appendChild(playerEl);
  });
};

var readyBtnUnlock = function readyBtnUnlock() {
  readyBtnChange(TPRENT, GREY, GREY);
  readyBtn.innerText = "Ready";
  readyBtn.style.pointerEvents = "initial";
};

var handleLeaderShotClock = function handleLeaderShotClock() {
  var count = setInterval(function () {
    var clockNum = parseInt(timer.innerText);
    var warnning;

    if (clockNum <= 6 && clockNum % 2 === 1) {
      warnning = clock.style.animation = "warnning 0.5s linear";
    } else if (clockNum <= 6 && clockNum % 2 === 0 && clockNum !== 0) {
      warnning = clock.style.animation = "_warnning 0.5s linear";
    } else {
      warnning = clock.style.animation = "unset";
    }

    (0, _sockets.getSocket)().emit(window.events.via, {
      num: num,
      warnning: warnning
    });
    timer.innerText = "".concat(num);
    num--;

    if (words.innerText === "Game Ended") {
      clearInterval(count);
      num = 30;
      timer.innerText = "".concat(num);
      (0, _sockets.getSocket)().emit(window.events.via, {
        num: num
      });
    }
  }, 1000);
};

exports.handleLeaderShotClock = handleLeaderShotClock;

var handleNormalShotClock = function handleNormalShotClock(_ref) {
  var num = _ref.num,
      warnning = _ref.warnning;
  timer.innerText = "".concat(num);
  clock.style.animation = warnning;
};

exports.handleNormalShotClock = handleNormalShotClock;

var handleUpdatePlayer = function handleUpdatePlayer(_ref2) {
  var sockets = _ref2.sockets;
  addPlayer(sockets);
};

exports.handleUpdatePlayer = handleUpdatePlayer;

var setWords = function setWords(text) {
  words.innerText = "";
  words.innerText = text;
};

var handleGameStarted = function handleGameStarted() {
  setWords("");
  (0, _paint.disableCanvas)();
};

exports.handleGameStarted = handleGameStarted;

var handleGameEnded = function handleGameEnded() {
  setWords("Game Ended");
  setTimeout(function () {
    return (0, _paint.handleFilled)({
      color: "white"
    });
  }, 3000);
  (0, _paint.disableCanvas)();
};

exports.handleGameEnded = handleGameEnded;

var handleLeaderNotifi = function handleLeaderNotifi(_ref3) {
  var word = _ref3.word;
  (0, _paint.enableCanvas)();
  setWords(word);
  (0, _chat.disableChat)();
};

exports.handleLeaderNotifi = handleLeaderNotifi;

var handleGameStarting = function handleGameStarting() {
  setWords("Game Starting Soon (๑•̀ㅂ•́)و✧");
};

exports.handleGameStarting = handleGameStarting;

var handlereadyBtnLock = function handlereadyBtnLock() {
  readyBtnChange(LOCK, WHITE, LOCK);
  readyBtn.innerText = "LOCK";
  readyBtn.style.pointerEvents = "none";
};

exports.handlereadyBtnLock = handlereadyBtnLock;

var handleUnLock = function handleUnLock() {
  readyClick = false;
  readyBtnUnlock();
  (0, _chat.enableChat)();
};

exports.handleUnLock = handleUnLock;

var handleReady = function handleReady() {
  var ready = readyBtn.innerText;

  if (!readyClick) {
    (0, _sockets.getSocket)().emit(window.events.ready, {
      ready: ready
    });
    readyBtnChange(GREEN, WHITE, GREEN);
    readyClick = true;
  } else {
    (0, _sockets.getSocket)().emit(window.events.unready, {
      ready: ready
    });
    readyBtnChange(TPRENT, GREY, GREY);
    readyClick = false;
  }
};

if (readyBtn) {
  readyBtn.addEventListener("click", handleReady);
}

},{"./chat":1,"./paint":5,"./sockets":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSocket = void 0;

var _notifications = require("./notifications");

var _chat = require("./chat");

var _paint = require("./paint");

var _players = require("./players");

var _login = require("./login");

var socket = null;

var getSocket = function getSocket() {
  return socket;
};

exports.getSocket = getSocket;

var initSockets = function initSockets() {
  // eslint-disable-next-line no-undef
  var socket = io("/");
  var _window = window,
      events = _window.events;
  socket.on(events.newUser, _notifications.handleNewUser);
  socket.on(events.disconnected, _notifications.handleDisconnect);
  socket.on(events.newMsg, _chat.handleNewMsg);
  socket.on(events.beganPath, _paint.handleBeganPath);
  socket.on(events.strokedPath, _paint.handleStrokedPath);
  socket.on(events.filled, _paint.handleFilled);
  socket.on(events.updatePlayer, _players.handleUpdatePlayer);
  socket.on(events.gameStarted, _players.handleGameStarted);
  socket.on(events.gameEnded, _players.handleGameEnded);
  socket.on(events.leaderNotifi, _players.handleLeaderNotifi);
  socket.on(events.gameStarting, _players.handleGameStarting);
  socket.on(events.readyBtnLock, _players.handlereadyBtnLock);
  socket.on(events.unLock, _players.handleUnLock);
  socket.on(events.leaderShotClock, _players.handleLeaderShotClock);
  socket.on(events.normalShotClock, _players.handleNormalShotClock);
  socket.on(events.goAway, _login.handleGoAway);
};

var init = function init() {
  return initSockets();
};

init();

},{"./chat":1,"./login":2,"./notifications":4,"./paint":5,"./players":6}]},{},[3]);
