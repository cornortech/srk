import mongoose from "mongoose";
import { env } from "./env";

const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = env.DATABASE_URL || process.env.DATABASE_URL || "";
    if (!uri) {
      throw new Error("DATABASE_URL is not set");
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // Don't exit the process - let the server continue running
    // It can still respond to health checks
    throw error;
  }
};

export default connectToDatabase;
