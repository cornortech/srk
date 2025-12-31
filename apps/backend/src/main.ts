import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import connectDB from "./config/database";


connectDB();

const PORT = Number(process.env.PORT || 4000);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
