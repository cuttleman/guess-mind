"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _path = require("path");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _socket = _interopRequireDefault(require("socket.io"));

var _socketController = _interopRequireDefault(require("./socketController"));

var _events = _interopRequireDefault(require("./events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var app = (0, _express["default"])();
var PORT = process.env.PORT || 2000;
app.set("view engine", "pug");
app.set("views", (0, _path.join)(__dirname, "views"));
app.use((0, _morgan["default"])("dev"));
app.use((0, _cookieParser["default"])());
app.use("/static", _express["default"]["static"]((0, _path.join)(__dirname, "static")));
app.get("/", function (req, res) {
  return res.render("main", {
    events: JSON.stringify(_events["default"])
  });
});

var handleListening = function handleListening() {
  console.log("\uD83D\uDFE2  Server running : http://localhost:".concat(PORT));
};

var server = app.listen(PORT, handleListening);

var io = _socket["default"].listen(server);

io.on("connection", function (socket) {
  return (0, _socketController["default"])(socket, io);
});