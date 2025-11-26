import * as dotenv from "dotenv";
dotenv.config();
import admin from "../config/firebase";

async function createFirebaseUser() {
  try {
    console.log("Creating Firebase user...");
    const userRecord = await admin.auth().createUser({
      email: "santosh.dev300@gmail.com",
      password: "Pa$$w0rd!",
      displayName: "SantoshDev",
    });

    console.log("Successfully created new user:", userRecord.uid);
  } catch (error) {
    console.error("Error creating Firebase user:", error);
  }
}

export default createFirebaseUser;

createFirebaseUser();
