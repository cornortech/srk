import mongoose from "mongoose";
import { env } from "./env";

const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = env.DATABASE_URL || process.env.DATABASE_URL || "";
    await mongoose.connect(uri, {
      maxPoolSize: 10, // Limit maximum connections to 10 instead of default 100
      minPoolSize: 2,  // Maintain at least 2 connections in the pool
      maxIdleTimeMS: 30000, // Close idle connections after 30 seconds
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if server is not available
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log("Connected to MongoDB successfully with connection pooling");
    console.log(`Max pool size: 10, Min pool size: 2`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
