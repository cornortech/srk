import { Request, Response } from "express";
import { UserModel } from "../model/userModel";
import { BankModel } from "../model/bankModel";
import { KYCModel } from "../model/kycModel";

class UserController {
  /**
   * Get bank details by user ID
   */
  static async getBankDetailsByUserId(
    req: Request,
    res: Response
  ): Promise<void> {
    const { userId } = req.params;

    const user = await BankModel.findById({
      userId: userId,
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ bankDetails: user });
  }

  /**
   * Get KYC details by user ID
   */
  static async getKycDetailsByUserId(
    req: Request,
    res: Response
  ): Promise<void> {
    const { userId } = req.params;

    const kycDetails = await KYCModel.findById({
      userId,
    });

    if (!kycDetails) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ kycDetails });
  }

  /**
   * Update user details by user ID
   */
  static async updateUserDetailsByUserId(
    req: Request,
    res: Response
  ): Promise<void> {
    const { userId } = req.params;
    const updateData = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User details updated successfully",
      user: updatedUser,
    });
  }

  /**
   * Get user details by user ID
   */
  static async getUserDetailsByUserId(
    req: Request,
    res: Response
  ): Promise<void> {
    const { userId } = req.params;

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  }
}

export default UserController;
