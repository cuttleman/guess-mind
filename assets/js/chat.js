import { getSocket } from "./sockets";

const messages = document.getElementById("jsMessages");
const sendMsg = document.getElementById("jsSendMsg");

const appendMsg = (text, nickname) => {
  const li = document.createElement("li");
  li.innerHTML = `
        <span class="author ${nickname ? "out" : "self"}">${
    nickname ? nickname : "You"
  }</span>: ${text}
    `;
  messages.appendChild(li);
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

export const handleNewMsg = ({ message, nickname }) =>
  appendMsg(message, nickname);

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}
