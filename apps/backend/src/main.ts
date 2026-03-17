import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import connectDB from "./config/database";
import mongoose from "mongoose";
import { startConnectionPoolMonitoring } from "./utils/dbMonitor";


connectDB();

const PORT = Number(process.env.PORT || 4000);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start monitoring connection pool (log every 5 minutes in production, 1 minute in dev)
  const monitoringInterval = process.env.NODE_ENV === 'production' ? 300000 : 60000;
  startConnectionPoolMonitoring(monitoringInterval);
});

// Graceful shutdown - properly close MongoDB connections
const gracefulShutdown = async () => {
  console.log('\nReceived shutdown signal. Closing server gracefully...');
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    } catch (err) {
      console.error('Error during MongoDB disconnect:', err);
      process.exit(1);
    }
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Monitor MongoDB connection pool
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});
