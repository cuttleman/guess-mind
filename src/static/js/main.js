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

},{"./sockets":6}],2:[function(require,module,exports){
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

},{"./sockets":6}],3:[function(require,module,exports){
"use strict";

require("./sockets");

require("./login");

require("./notifications");

require("./chat");

require("./paint");

},{"./chat":1,"./login":2,"./notifications":4,"./paint":5,"./sockets":6}],4:[function(require,module,exports){
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
exports.handleStrokedPath = exports.handleBeganPath = void 0;

var _sockets = require("./sockets");

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
  ctx.lineTo(x, y);
  ctx.stroke();
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
      y: y
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

function handleFillCanvas() {
  if (filling) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
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

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleFillCanvas);
  canvas.addEventListener("contextmenu", handleCM);
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
      y = _ref2.y;
  strokePath(x, y);
};

exports.handleStrokedPath = handleStrokedPath;

},{"./sockets":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSockets = exports.updateSocket = exports.getSocket = void 0;

var _notifications = require("./notifications");

var _chat = require("./chat");

var _paint = require("./paint");

var socket = null;

var getSocket = function getSocket() {
  return socket;
};

exports.getSocket = getSocket;

var updateSocket = function updateSocket(aSocket) {
  return socket = aSocket;
};

exports.updateSocket = updateSocket;

var initSockets = function initSockets(aSocket) {
  var _window = window,
      events = _window.events;
  updateSocket(aSocket);
  aSocket.on(events.newUser, _notifications.handleNewUser);
  aSocket.on(events.disconnected, _notifications.handleDisconnect);
  aSocket.on(events.newMsg, _chat.handleNewMsg);
  aSocket.on(events.beganPath, _paint.handleBeganPath);
  aSocket.on(events.strokedPath, _paint.handleStrokedPath);
};

exports.initSockets = initSockets;

},{"./chat":1,"./notifications":4,"./paint":5}]},{},[3]);
