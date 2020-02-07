import {
  disableCanvas,
  hideControls,
  showControls,
  enableCanvas
} from "./paint";
import { disableChat } from "./chat";

const playerBoard = document.getElementById("jsPBoard");
const words = document.getElementById("jsWords");

const addPlayer = players => {
  playerBoard.innerHTML = "";
  players.forEach(player => {
    const playerEl = document.createElement("span");
    playerEl.innerText = `${player.nickname} : ${player.point}`;
    playerBoard.appendChild(playerEl);
  });
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
  hideControls();
  disableCanvas();
};

export const handleGameEnded = () => {
  setWords("Game Ended");
  hideControls();
  disableCanvas();
};

export const handleLeaderNotifi = ({ word }) => {
  enableCanvas();
  showControls();
  setWords(word);
  disableChat();
};

export const handleGameStarting = () => {
  setWords("Game Starting Soon!😊");
};
