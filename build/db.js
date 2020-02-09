"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

_mongoose["default"].connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

var DB = _mongoose["default"].connection;
DB.once("open", function () {
  console.log("🟢  Connected to DB");
});
DB.on("error", function (error) {
  console.log("\uD83D\uDD34  Error on DB Connection:".concat(error));
});