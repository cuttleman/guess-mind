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

let socket = null;

export const initSockets = aSocket => {
  const { events } = window;
  socket = aSocket;
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
};

export const getSocket = () => socket;
