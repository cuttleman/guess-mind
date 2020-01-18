import express from "express";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

app.use("/static", express.static(join("static")));
app.get("/", (req, res) => {
  res.render("main");
});

const handleListening = () => {
  console.log(`🟢  Server running : http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
