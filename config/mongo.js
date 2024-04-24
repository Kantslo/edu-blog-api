import mongoose from "mongoose";

const connect = () => {
  try {
    const URI = process.env.MONGO_URI;
    mongoose.connect(URI);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default connect;
