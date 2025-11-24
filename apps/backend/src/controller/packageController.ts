import { Request, Response } from "express";
import { PackageModel } from "../model/packageModel";

class PackageController {
  static async createPackage(req: Request, res: Response): Promise<void> {
    const { price, description, currency, features, title, image } = req.body;

    if (!title || !price || !description || !currency || !features) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    await PackageModel.create({
      price,
      description,
      currency,
      features,
      title,
      image,
    });

    res.status(201).json({ message: "Package created successfully" });
  }

  static async getAllPackages(req: Request, res: Response): Promise<void> {
    const packages = await PackageModel.find();

    res.status(200).json({ packages });
  }

  static async getPackageById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const packageExist = await PackageModel.findById(id);

    if (!packageExist) {
      res.status(404).json({ message: "Package not found" });
      return;
    }

    res.status(200).json({ packageExist });
  }

  static async deletePackageById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const packageExist = await PackageModel.findById(id);

    if (!packageExist) {
      res.status(404).json({ message: "Package not found" });
      return;
    }

    await PackageModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Package deleted successfully" });
  }
}

export default PackageController;
