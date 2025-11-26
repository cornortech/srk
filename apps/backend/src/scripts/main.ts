// src/scripts/main.ts
import path from "path";
import dotenv from "dotenv";

// Load .env at the very beginning
dotenv.config({ path: path.join(__dirname, "../../.env") }); // load env first

import { env } from "../config/env"; // now env variables are set

import connectDbForScript from "./connectDb";
import withDrawBalanceInsufficientBugFixScript from "./wthdrlBlncInsufficientBugFixScript";

console.log("Firebase project ID:", env.FIREBASE_PROJECT_ID);

async function main() {
  console.log("Script running...");
  let dbConn;
  try {
    dbConn = await connectDbForScript();

    await withDrawBalanceInsufficientBugFixScript(
      "prativabhattaraiskt@gmail.com"
    );
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    if (dbConn) {
      await dbConn.disconnect();
    }
  }
}

main();
