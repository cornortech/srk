import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import connectDB from "./config/database";
import { env, validateEnv } from "./config/env";
import { logger } from "./services/loggerService";


async function startServer() {
  console.log("[STARTUP] Starting SRK Backend Server...");

  try {
    validateEnv();
  } catch (error) {
    console.error("[STARTUP] ✗ Startup validation failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }

  console.log("[STARTUP] Environment:", env.NODE_ENV || "development");
  console.log("[STARTUP] Port:", Number(env.PORT || 8080));
  console.log("[STARTUP] Database name:", env.DATABASE_NAME || '(default)');
  console.log("[STARTUP] R2 prefix folder:", env.R2_PREFIX_FOLDER);

  try {
    console.log("[DATABASE] Attempting to connect to MongoDB...");
    await connectDB();
    console.log("[DATABASE] ✓ Connected to MongoDB successfully");
  } catch (error) {
    console.error("[DATABASE] ✗ Failed to connect to MongoDB:", error instanceof Error ? error.message : error);
    console.error("[DATABASE] Continuing server startup - will retry connection on demand");
  }

  // Clean old logs at startup
  try {
    await logger.clearOldLogs(7); // Keep logs for 7 days
    console.log("[STARTUP] ✓ Cleaned old logs (older than 7 days)");
  } catch (error) {
    console.warn("[STARTUP] ⚠ Failed to clean old logs:", error instanceof Error ? error.message : error);
  }

  // Periodic cleanup every hour
  setInterval(async () => {
    try {
      await logger.clearOldLogs(7);
    } catch (error) {
      console.warn("[MAINTENANCE] Failed to clean old logs:", error instanceof Error ? error.message : error);
    }
  }, 60 * 60 * 1000); // Every hour

  const PORT = Number(env.PORT || 4000);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] ✓ Server running on http://0.0.0.0:${PORT}`);
    console.log(`[SERVER] ✓ Health check available at http://0.0.0.0:${PORT}/health`);
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (reason, promise) => {
    const errorMsg = reason instanceof Error ? reason.message : String(reason);
    console.error('[ERROR] Unhandled Rejection at:', promise, 'reason:', reason);
    logger.error('backend', `UNHANDLED REJECTION: ${errorMsg}`, reason instanceof Error ? reason : new Error(String(reason)), {
      reason: String(reason),
      type: 'unhandledRejection',
    });
  });

  process.on('uncaughtException', (error) => {
    console.error('[ERROR] Uncaught Exception:', error);
    logger.error('backend', `UNCAUGHT EXCEPTION: ${error.message}`, error, {
      type: 'uncaughtException',
      message: error.message,
    });
  });
}

console.log("[STARTUP] Process ID:", process.pid);
console.log("[STARTUP] Node version:", process.version);
startServer();
