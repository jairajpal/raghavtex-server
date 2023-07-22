import mongoose from "mongoose";
import "dotenv/config";

const connection = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Database got connected");
  } catch (error) {
    console.log(error);
  }
};

export default connection;
