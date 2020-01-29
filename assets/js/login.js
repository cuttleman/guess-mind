const body = document.querySelector("body");
const loginForm = document.getElementById("jsLoginForm");
const input = loginForm.querySelector("input");

const LOGIN = "logIn";
const LOGOUT = "logOut";
const NICKNAME = "nickname";
const nickName = localStorage.getItem(NICKNAME);

const handleLogin = e => {
  e.preventDefault();
  const { value } = input;
  input.value = "";
  localStorage.setItem(NICKNAME, value);
};

if (nickName === null) {
  body.className = LOGIN;
} else {
  body.className = LOGOUT;
}

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}
