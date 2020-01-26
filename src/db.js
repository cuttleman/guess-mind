import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const DB = mongoose.connection;

DB.once("open", () => {
  console.log("🟢  connected to DB");
});
DB.on("error", error => {
  console.log(`🔴  Error on DB Connection:${error}`);
});
