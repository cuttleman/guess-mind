const notifications = document.getElementById("jsNotifications");

export const handleNewUser = ({ nickname }) => {
  notifications.innerHTML = `${nickname} join!`;
};
