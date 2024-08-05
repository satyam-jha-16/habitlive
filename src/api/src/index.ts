import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routers/habit.router.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: "*", // Allow requests from any origin
  credentials: true, // If cookies are used, set this to true
  optionsSuccessStatus: 200,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use('/api', router);

const MONGO_URI = process.env.MONGO_URI as string;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("error connecting to database, ", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
