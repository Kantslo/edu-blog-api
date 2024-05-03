import express from "express";
import { body } from "express-validator";

import User from "../models/user.js";
import {
  signup,
  login,
  getUserStatus,
  updateUserStatus,
} from "../controllers/index.js";
import isAuth from "../middlewares/is-auth.js";

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail address already exists!!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  signup
);

router.post("/login", login);

router.get("/status", isAuth, getUserStatus);

router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  updateUserStatus
);

export default router;
