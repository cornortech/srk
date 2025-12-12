import mongoose from "mongoose";
import * as path from "path";
import * as fs from "fs";
import dotenv from "dotenv";
import { growSocialMediaPackageModel } from "../../model/growSocialMediaPackageModel";
import { growSocialMediaPackageTypeModel } from "../../model/growSocialMediaPackageTypeModel";
import { growSocialMediaPackageSubTypeModel } from "../../model/growSocialMediaPackageSubTypeModel";

// Load environment variables
dotenv.config({
    path: path.join(process.cwd(), "apps/backend/.env"),
});

interface PackageSubType {
    name: string;
    description: string;
    noOfLikes?: number;
    noOfVideos?: number;
    noOfFollowers?: number;
    amount: number;
}

interface PackageType {
    name: string;
    description: string;
    packageSubType: PackageSubType[];
}

interface Package {
    name: string;
    description: string;
    amount: number;
    amountBeforeDiscount: number;
    isPopular: boolean;
    features: string[];
    socialMedia: string[];
    packageType: PackageType[];
}

async function createGrowPackages() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.DATABASE_URL || "mongodb://localhost:27017/srk";
        console.log(mongoUri);
        // await mongoose.connect(mongoUri);
        console.log("✓ Connected to MongoDB");

        // Read dummy data
        const dummyDataPath = path.join(
            __dirname,
            "dummySrkGrowPackage.json"
        );
        const dummyData: Package[] = JSON.parse(
            fs.readFileSync(dummyDataPath, "utf-8")
        );
        console.log(`✓ Loaded ${dummyData.length} packages from dummy data`);

        // Clear existing data
        await growSocialMediaPackageModel.deleteMany({});
        await growSocialMediaPackageTypeModel.deleteMany({});
        await growSocialMediaPackageSubTypeModel.deleteMany({});
        console.log("✓ Cleared existing data from collections");

        // Create packages
        for (const pkg of dummyData) {
            // Create package
            const createdPackage = await growSocialMediaPackageModel.create({
                name: pkg.name,
                descripttion: pkg.description,
                socialMediaPlatforms: pkg.socialMedia,
                amount: pkg.amount,
            });
            console.log(`✓ Created package: ${pkg.name}`);

            // Create package types and subtypes
            for (const packageType of pkg.packageType) {
                const createdPackageType =
                    await growSocialMediaPackageTypeModel.create({
                        growSocialMediaPackageId: createdPackage._id,
                        name: packageType.name,
                        description: packageType.description,
                        amount: packageType.packageSubType[0]?.amount || 0,
                    });
                console.log(
                    `  ✓ Created package type: ${packageType.name}`
                );

                // Create subtypes
                for (const subType of packageType.packageSubType) {
                    await growSocialMediaPackageSubTypeModel.create({
                        growSocialMediaPackageId: createdPackage._id,
                        growSocialMediaPackageTypeId: createdPackageType._id,
                        name: subType.name,
                        description: subType.description,
                        noOfLikes: subType.noOfLikes,
                        noOfVideos: subType.noOfVideos,
                        noOfFollowers: subType.noOfFollowers,
                    });
                }
                console.log(
                    `    ✓ Created ${packageType.packageSubType.length} subtypes`
                );
            }
        }

        console.log("\n✓ Successfully seeded all grow packages!");
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("✗ Error creating grow packages:", error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

createGrowPackages();
