import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
}
