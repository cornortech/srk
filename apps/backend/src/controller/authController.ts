import { Request, Response } from "express";
import AuthService from "../services/authService";
import { UserModel } from "../model/userModel";
import { adminModel } from "../model/adminModel";

class AuthController {
  /**
   * Handles user registration
   */
  static async register(req: Request, res: Response): Promise<void> {
    const {
      firstName,
      lastName,
      phoneNumber,
      gender,
      dob,
      country,
      email,
      password,
      referralCode,
      profilePicture,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !gender ||
      !dob ||
      !country ||
      !email ||
      !password
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if the email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email is already registered" });
      return;
    }

    // Hash the password
    const hashedPassword = await AuthService.hashPassword(password);

    // Generate a unique referral code (example logic)
    const generatedReferralCode = `${firstName
      .substring(0, 3)
      .toUpperCase()}${Date.now()}`;

    // Create a new user instance
    const newUser = new UserModel({
      firstName,
      lastName,
      phoneNumber,
      gender,
      dob,
      country,
      email,
      password: hashedPassword,
      referralCode: referralCode || generatedReferralCode,
      profilePicture: profilePicture || null,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        referralCode: newUser.referralCode,
      },
    });
  }

  /**
   * Handles user login
   */
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Fetch user from the database
    const userExist = await UserModel.findOne({ email });
    const adminExist = await adminModel.findOne({ email });

    const loggedInUser = userExist || adminExist;

    if (!loggedInUser) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Verify password
    const isPasswordValid = await AuthService.verifyPassword(
      password,
      loggedInUser.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Determine role and redirection URL
    const role = adminExist ? "admin" : "user";
    const redirectionUrl = adminExist ? "/admin/earning" : "/study";

    res.status(200).json({
      message: "Login successful",
      role,
      redirectionUrl,
      userId: loggedInUser._id.toString(),
    });
  }
}

export default AuthController;
