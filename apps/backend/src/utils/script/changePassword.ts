import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
dotenv.config();
import { UserModel } from "../../model/userModel";
import connectToDatabase from "../../config/database";
import AuthService from "../../services/authService";

// import { connectToDatabase } from "../../config/dbConfig";

const changePassword = async (email: string, newPassword: string) => {
  try {
    if (!email || !newPassword) {
      throw new Error("Email and new password are required");
    }
    if (typeof email !== "string" || typeof newPassword !== "string") {
      throw new Error("Email and new password must be strings");
    }
    if (!email.includes("@")) {
      throw new Error("Invalid email format");
    }
    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }
    const userExist = await UserModel.findOne({
      email,
    });

    if (!userExist) {
      throw new Error("User does not exist");
    }

    userExist.password = await AuthService.hashPassword(newPassword);

    await userExist.save();

    console.log("Password changed successfully for user:", email);
    return userExist;
  } catch (error) {
    console.log("Error in changePassword script:", error);
    throw error;
  }
};

const main = async (email: string, password: string) => {
  try {
    connectToDatabase();
    await changePassword(email, password);
    process.exit(0);
  } catch (error) {
    console.log("Error in changePassword script:", error);
    throw error;
  }
};

main("niteshshahi6408@gmail.com", "niTesh*1928");
