import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserModel } from "../model/userModel";
import crypto from "crypto";

class AuthService {
  /**
   * Hashes a password
   * @param password - The plain text password
   * @returns The hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verifies a password against a hashed password
   * @param password - The plain text password
   * @param hash - The hashed password
   * @returns True if the password matches, false otherwise
   */
  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  /**
   * Generates a jwt token
   * @param user - The user object
   * @returns The jwt token
   */

  static async generateJwtToken(user: {
    email: string;
    userId: string;
  }): Promise<string> {
    return jwt.sign(user, "1234343");
  }

  /**
   * Verifies a jwt token
   * @param token
   * @returns
   */
  static async verifyJwtToken(token: string): Promise<any> {
    return jwt.verify(token, env.JWT_SECRET as string);
  }
  // Referral Code Generation Function
  static async generateUniqueReferralCode(): Promise<string> {
    const generateReferralCode = () =>
      crypto.randomBytes(6).toString("hex").toUpperCase();

    let referralCode: string;
    let isUnique = false;

    do {
      referralCode = generateReferralCode();
      const existingUser = await UserModel.findOne({ referralCode });
      isUnique = !existingUser;
    } while (!isUnique);

    return referralCode;
  }
  static generateRandomPassword(): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
    return password;
  }
}

export default AuthService;
