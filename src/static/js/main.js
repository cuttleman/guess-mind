(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

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
  window.socket = io("/");
  window.socket.emit(window.events.setNickname, {
    nickname: nickname
  });
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

},{}],2:[function(require,module,exports){
"use strict";

require("./login");

},{"./login":1}]},{},[2]);
