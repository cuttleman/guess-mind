import { handleNewUser, handleDisconnect } from "./notifications";
import { handleNewMsg } from "./chat";
import { handleBeganPath, handleStrokedPath } from "./paint";

let socket = null;

export const getSocket = () => socket;

export const updateSocket = aSocket => (socket = aSocket);

export const initSockets = aSocket => {
  const { events } = window;
  updateSocket(aSocket);
  aSocket.on(events.newUser, handleNewUser);
  aSocket.on(events.disconnected, handleDisconnect);
  aSocket.on(events.newMsg, handleNewMsg);
  aSocket.on(events.beganPath, handleBeganPath);
  aSocket.on(events.strokedPath, handleStrokedPath);
};
