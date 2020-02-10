const notifications = document.getElementById("jsNotifications");
const NICKNAME = "nickname";

const fireNotification = (text, name) => {
  const notification = document.createElement("div");
  notification.innerHTML = text;
  notification.className = name;
  notifications.appendChild(notification);
};

export const handleNewUser = ({ nickname }) =>
  fireNotification(`${nickname} joined!`, "logged join");

export const handleDisconnect = ({ nickname }) =>
  fireNotification(`${nickname} logOut!`, "logged leave");

export const handleGoAway = () => {
  localStorage.removeItem(NICKNAME);
  alert("User is full😥");
  setTimeout(() => location.reload(), 100);
};
