const words = [
  "소방차",
  "강아지",
  "오동나무",
  "떡갈나무",
  "방패",
  "눈물",
  "유재석",
  "개냥이",
  "패션왕",
  "노트북",
  "중이염",
  "코로나",
  "감기",
  "날다람쥐",
  "말",
  "돼지",
  "아이폰",
  "에어팟",
  "콩나물",
  "펭수",
  "뽀로로",
  "콩이"
];

export const chooseWords = () =>
  words[Math.floor(Math.random() * words.length)];
