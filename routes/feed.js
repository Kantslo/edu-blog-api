import express from "express";
import { body } from "express-validator";

import { getPosts, createPost } from "../controllers/index.js";

const router = express.Router();

router.get("/posts", getPosts);

router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);

export default router;
