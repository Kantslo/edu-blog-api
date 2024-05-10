import bcrypt from "bcrypt";

import User from "../models/user.js";

const resolvers = {
  createUser: async (args, req) => {
    const { email, name, password } = args.userInput;
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
};

export default resolvers;
