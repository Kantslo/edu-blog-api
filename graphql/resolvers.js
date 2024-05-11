import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

const resolvers = {
  createUser: async (args, req) => {
    const { email, name, password } = args.userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "E-mail is invalid." });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: "Password is too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashedPassword,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async ({ email, password }, req) => {
    const user = await User.findOne(email);
    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect.");
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return {
      token,
      userId: user._id.toString(),
    };
  },
};

export default resolvers;
