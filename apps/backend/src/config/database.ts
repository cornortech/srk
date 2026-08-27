import mongoose from "mongoose";
import { env } from "./env";

const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = env.DATABASE_URL;
    if (!uri) {
      console.error('[DATABASE] ERROR: DATABASE_URL environment variable is not set');
      throw new Error("DATABASE_URL is not set");
    }
    
    // Mask password in logs for security
    const maskedUri = uri.replace(/:([^@]+)@/, ':***@');
    console.log('[DATABASE] Connecting to:', maskedUri);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
    });
    
    console.log("[DATABASE] ✓ Connected to MongoDB successfully");
    console.log("[DATABASE] Database name:", mongoose.connection.name);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[DATABASE] ✗ Connection failed:", errorMessage);
    // Don't exit the process - let the server continue running
    // It can still respond to health checks
    throw error;
  }
};

export default connectToDatabase;
