import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import connectDB from "./config/database";


async function startServer() {
  try {
    await connectDB();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    // Continue starting the server even if DB connection fails
    // Health checks will still pass, and the app can retry the connection
  }

  const PORT = Number(process.env.PORT || 8080);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
