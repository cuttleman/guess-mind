"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chooseWords = void 0;
var words = ["소방차", "강아지", "오동나무", "떡갈나무", "방패", "눈물", "유재석", "개냥이", "패션왕", "노트북", "중이염", "코로나", "감기", "날다람쥐", "말", "돼지"];

var chooseWords = function chooseWords() {
  return words[Math.floor(Math.random() * words.length)];
};

exports.chooseWords = chooseWords;