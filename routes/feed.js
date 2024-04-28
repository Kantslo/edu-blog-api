import express from "express";
import { body } from "express-validator";

import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/index.js";

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

router.get("/post/:postId", getPost);

router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost
);

router.delete("/post/:postId", deletePost);

export default router;
