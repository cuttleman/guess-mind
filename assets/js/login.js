const body = document.querySelector("body");
const loginForm = document.getElementById("jsLoginForm");
const input = loginForm.querySelector("input");

const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";
const NICKNAME = "nickname";
const nickName = localStorage.getItem(NICKNAME);

const handleLogin = e => {
  e.preventDefault();
  const { value } = input;
  input.value = "";
  localStorage.setItem(NICKNAME, value);
  body.className = LOGGED_IN;
  login(value);
};

const login = nickname => {
  window.socket = io("/");
  window.socket.emit(window.events.setNickname, { nickname });
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
