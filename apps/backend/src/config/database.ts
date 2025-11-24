import mongoose from "mongoose";
import { env } from "./env";

const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = env.DATABASE_URL || process.env.DATABASE_URL || "";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
