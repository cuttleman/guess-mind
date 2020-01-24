const socket = io();

socket.on("server hello", () => {
  console.log("server hi!");
});

socket.emit("client hello");
