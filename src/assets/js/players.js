import { disableCanvas, enableCanvas, handleFilled } from "./paint";
import { disableChat, enableChat } from "./chat";
import { getSocket } from "./sockets";

const playerBoard = document.getElementById("jsPBoard");
const words = document.getElementById("jsWords");
const readyBtn = document.getElementById("jsPReady");
const clock = document.getElementById("jsPClock");
const timer = clock.querySelector("span");

const GREY = "#95a5a6";
const TPRENT = "transparent";
const GREEN = "#2ecc71";
const WHITE = "white";
const LOCK = "#485460";

let readyClick = false;
let num = 30;

const readyBtnChange = (bgColor, font, border) => {
  readyBtn.style.backgroundColor = bgColor;
  readyBtn.style.color = font;
  readyBtn.style.borderColor = border;
};

const addPlayer = players => {
  playerBoard.innerHTML = "";
  players.forEach(player => {
    const playerEl = document.createElement("span");
    playerEl.innerText = `${player.nickname} : ${player.point}`;
    playerBoard.appendChild(playerEl);
  });
};

const readyBtnUnlock = () => {
  readyBtnChange(TPRENT, GREY, GREY);
  readyBtn.innerText = "Ready";
  readyBtn.style.pointerEvents = "initial";
};

export const handleLeaderShotClock = () => {
  const count = setInterval(() => {
    const clockNum = parseInt(timer.innerText);
    let warnning;
    if (clockNum <= 6 && clockNum % 2 === 1) {
      warnning = clock.style.animation = "warnning 0.5s linear";
    } else if (clockNum <= 6 && clockNum % 2 === 0 && clockNum !== 0) {
      warnning = clock.style.animation = "_warnning 0.5s linear";
    } else {
      warnning = clock.style.animation = "unset";
    }
    getSocket().emit(window.events.via, { num, warnning });
    timer.innerText = `${num}`;
    num--;
    if (words.innerText === "Game Ended") {
      clearInterval(count);
      num = 30;
      timer.innerText = `${num}`;
      getSocket().emit(window.events.via, { num });
    }
  }, 1000);
};

export const handleNormalShotClock = ({ num, warnning }) => {
  timer.innerText = `${num}`;
  clock.style.animation = warnning;
};

export const handleUpdatePlayer = ({ sockets }) => {
  addPlayer(sockets);
};

const setWords = text => {
  words.innerText = "";
  words.innerText = text;
};

export const handleGameStarted = () => {
  setWords("");
  disableCanvas();
};

export const handleGameEnded = () => {
  setWords("Game Ended");
  setTimeout(() => handleFilled({ color: "white" }), 3000);
  disableCanvas();
};

export const handleLeaderNotifi = ({ word }) => {
  enableCanvas();
  setWords(word);
  disableChat();
};

export const handleGameStarting = () => {
  setWords("Game Starting Soon (๑•̀ㅂ•́)و✧");
};

export const handlereadyBtnLock = () => {
  readyBtnChange(LOCK, WHITE, LOCK);
  readyBtn.innerText = "LOCK";
  readyBtn.style.pointerEvents = "none";
};

export const handleUnLock = () => {
  readyClick = false;
  readyBtnUnlock();
  enableChat();
};

const handleReady = () => {
  const ready = readyBtn.innerText;
  if (!readyClick) {
    getSocket().emit(window.events.ready, { ready });
    readyBtnChange(GREEN, WHITE, GREEN);
    readyClick = true;
  } else {
    getSocket().emit(window.events.unready, { ready });
    readyBtnChange(TPRENT, GREY, GREY);
    readyClick = false;
  }
};

if (readyBtn) {
  readyBtn.addEventListener("click", handleReady);
}
