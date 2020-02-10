import { handleNewUser, handleDisconnect } from "./notifications";
import { handleNewMsg } from "./chat";
import { handleBeganPath, handleStrokedPath, handleFilled } from "./paint";
import {
  handleUpdatePlayer,
  handleGameStarted,
  handleLeaderNotifi,
  handleGameEnded,
  handleGameStarting,
  handlereadyBtnLock,
  handleUnLock,
  handleLeaderShotClock,
  handleNormalShotClock
} from "./players";
import { handleGoAway } from "./login";

let socket = null;

export const getSocket = () => socket;

const initSockets = () => {
  // eslint-disable-next-line no-undef
  const socket = io("/");
  const { events } = window;
  socket.on(events.newUser, handleNewUser);
  socket.on(events.disconnected, handleDisconnect);
  socket.on(events.newMsg, handleNewMsg);
  socket.on(events.beganPath, handleBeganPath);
  socket.on(events.strokedPath, handleStrokedPath);
  socket.on(events.filled, handleFilled);
  socket.on(events.updatePlayer, handleUpdatePlayer);
  socket.on(events.gameStarted, handleGameStarted);
  socket.on(events.gameEnded, handleGameEnded);
  socket.on(events.leaderNotifi, handleLeaderNotifi);
  socket.on(events.gameStarting, handleGameStarting);
  socket.on(events.readyBtnLock, handlereadyBtnLock);
  socket.on(events.unLock, handleUnLock);
  socket.on(events.leaderShotClock, handleLeaderShotClock);
  socket.on(events.normalShotClock, handleNormalShotClock);
  socket.on(events.goAway, handleGoAway);
};

const init = () => initSockets();

init();
