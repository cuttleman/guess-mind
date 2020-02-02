const notifications = document.getElementById("jsNotifications");

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
