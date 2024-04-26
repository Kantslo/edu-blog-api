import path from "path";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import uuid from "uuid";

import connect from "./config/mongo.js";
import feedRoutes from "./routes/feed.js";

dotenv.config();
connect();

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuid());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "images/png" ||
    file.mimetype === "images/jpg" ||
    file.mimetype === "jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter }));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cors());

app.use("/feed", feedRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({ message });
});

app.listen(8080);
