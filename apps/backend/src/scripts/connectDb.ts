import mongoose from "mongoose";

async function connectDbForScript() {
  const dbCon = await mongoose.connect(process.env.DATABASE_URL || "");
  dbCon.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });




  // why this didn't logged ?

  dbCon.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  return dbCon;
}

export default connectDbForScript;
