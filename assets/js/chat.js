import { getSocket } from "./sockets";

const messages = document.getElementById("jsMessages");
const sendMsg = document.getElementById("jsSendMsg");
const scrollAuto = () => (messages.scrollTop = messages.scrollHeight);

const appendMsg = (text, nickname) => {
  const li = document.createElement("li");
  li.className = `author ${nickname ? "out" : "self"}`;
  li.innerHTML = `<span>${nickname ? nickname : ""} ${text}</span>`;
  messages.appendChild(li);
  scrollAuto();
};

const handleSendMsg = e => {
  e.preventDefault();
  const input = sendMsg.querySelector("input");
  const { value } = input;
  const { events } = window;
  getSocket().emit(events.sendMsg, { message: value });
  input.value = "";
  appendMsg(value);
};

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}

export const handleNewMsg = ({ message, nickname }) =>
  appendMsg(message, nickname);

export const disableChat = () => {
  sendMsg.style.display = "none";
};

export const enableChat = () => {
  sendMsg.style.display = "block";
};
