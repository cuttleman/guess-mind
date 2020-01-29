import express from "express";
import logger from "morgan";
import { join } from "path";
import dotenv from "dotenv";
import socketIO from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import socketController from "./socketController";
import events from "./events";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));
app.use(logger("dev"));
app.use(express.static(join(__dirname, "static")));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.COOKIE_SCRET,
    resave: true,
    saveUninitialized: false
  })
);

app.get("/", (req, res) =>
  res.render("main", { events: JSON.stringify(events) })
);

const handleListening = () => {
  console.log(`🟢  Server running : http://localhost:${PORT}`);
};

const server = app.listen(PORT, handleListening);
const io = socketIO.listen(server);

io.on("connection", socket => socketController(socket));
