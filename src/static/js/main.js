(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleNewMsg = void 0;

var _sockets = require("./sockets");

var messages = document.getElementById("jsMessages");
var sendMsg = document.getElementById("jsSendMsg");

var appendMsg = function appendMsg(text, nickname) {
  var li = document.createElement("li");
  li.innerHTML = "\n        <span class=\"author ".concat(nickname ? "out" : "self", "\">").concat(nickname ? nickname : "You", "</span>: ").concat(text, "\n    ");
  messages.appendChild(li);
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

var handleNewMsg = function handleNewMsg(_ref) {
  var message = _ref.message,
      nickname = _ref.nickname;
  return appendMsg(message, nickname);
};

exports.handleNewMsg = handleNewMsg;

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}

},{"./sockets":7}],2:[function(require,module,exports){
"use strict";

var _sockets = require("./sockets");

var body = document.querySelector("body");
var loginForm = document.getElementById("jsLoginForm");
var input = loginForm.querySelector("input");
var LOGGED_OUT = "loggedOut";
var LOGGED_IN = "loggedIn";
var NICKNAME = "nickname";
var nickName = localStorage.getItem(NICKNAME);

var handleLogin = function handleLogin(e) {
  e.preventDefault();
  var value = input.value;
  input.value = "";
  localStorage.setItem(NICKNAME, value);
  body.className = LOGGED_IN;
  login(value);
};

var login = function login(nickname) {
  // eslint-disable-next-line no-undef
  var socket = io("/");
  socket.emit(window.events.setNickname, {
    nickname: nickname
  });
  (0, _sockets.initSockets)(socket);
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

},{"./sockets":7}],3:[function(require,module,exports){
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
exports.showControls = exports.hideControls = exports.enableCanvas = exports.disableCanvas = exports.handleFilled = exports.handleStrokedPath = exports.handleBeganPath = void 0;

var _sockets = require("./sockets");

var controls = document.getElementById("jsControls");
var canvas = document.getElementById("jsCanvas");
var ctx = canvas.getContext("2d");
var colors = document.getElementsByClassName("jsColor");
var range = document.getElementById("jsRange");
var mode = document.getElementById("jsMode");
var save = document.getElementById("jsSave");
var CANVAS_SIZE = 500;
var INITIAL_COLOR = "#2c2c2c";
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
/*pixel modifier*/

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
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

  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
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

var hideControls = function hideControls() {
  controls.style.opacity = 0;
};

exports.hideControls = hideControls;

var showControls = function showControls() {
  controls.style.opacity = 1;
};

exports.showControls = showControls;

if (canvas) {
  canvas.addEventListener("contextmenu", handleCM);
}

},{"./sockets":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleLeaderNotifi = exports.handleGameEnded = exports.handleGameStarted = exports.handleUpdatePlayer = void 0;

var _paint = require("./paint");

var playerBoard = document.getElementById("jsPBoard");
var words = document.getElementById("jsWords");

var addPlayer = function addPlayer(players) {
  playerBoard.innerHTML = "";
  players.forEach(function (player) {
    var playerEl = document.createElement("span");
    playerEl.innerText = "".concat(player.nickname, " : ").concat(player.point);
    playerBoard.appendChild(playerEl);
  });
};

var handleUpdatePlayer = function handleUpdatePlayer(_ref) {
  var sockets = _ref.sockets;
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
  (0, _paint.hideControls)();
};

exports.handleGameStarted = handleGameStarted;

var handleGameEnded = function handleGameEnded() {
  setWords("Game Ended");
  (0, _paint.hideControls)();
  (0, _paint.disableCanvas)();
};

exports.handleGameEnded = handleGameEnded;

var handleLeaderNotifi = function handleLeaderNotifi(_ref2) {
  var word = _ref2.word;
  (0, _paint.enableCanvas)();
  (0, _paint.showControls)();
  setWords(word);
};

exports.handleLeaderNotifi = handleLeaderNotifi;

},{"./paint":5}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSockets = exports.getSocket = void 0;

var _notifications = require("./notifications");

var _chat = require("./chat");

var _paint = require("./paint");

var _players = require("./players");

var socket = null;

var getSocket = function getSocket() {
  return socket;
};

exports.getSocket = getSocket;

var initSockets = function initSockets(aSocket) {
  var _window = window,
      events = _window.events;
  socket = aSocket;
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
};

exports.initSockets = initSockets;

},{"./chat":1,"./notifications":4,"./paint":5,"./players":6}]},{},[3]);
