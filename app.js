import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import feedRoutes from "./routes/feed.js";

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use("/feed", feedRoutes);

app.listen(8080);
