import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import initRoutes from "./src/routes";
import "./database.js";
import { cronJob } from "./src/utils/cronJob";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// app.get("/", (req, res) => {
//   res.send("Welcome to PurrPet API");
// });
//set header text/html
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send("Welcome to PurrPet API");
});

initRoutes(app);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

cronJob();
