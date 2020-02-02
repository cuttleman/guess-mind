(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

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
  input.value = "";
  appendMsg(value);
};

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}

},{}],2:[function(require,module,exports){
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

},{"./sockets":5}],3:[function(require,module,exports){
"use strict";

require("./sockets");

require("./login");

require("./notifications");

require("./chat");

},{"./chat":1,"./login":2,"./notifications":4,"./sockets":5}],4:[function(require,module,exports){
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
exports.initSockets = exports.updateSocket = exports.getSocket = void 0;

var _notifications = require("./notifications");

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
};

exports.initSockets = initSockets;

},{"./notifications":4}]},{},[3]);
