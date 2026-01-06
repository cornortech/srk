import mongoose from 'mongoose';
import { growSocialMediaPackageTypeModel } from '../model/growSocialMediaPackageTypeModel';
import { growSocialMediaPackageSubTypeModel } from '../model/growSocialMediaPackageSubTypeModel';
import { growSocialMediaPackageModel } from '../model/growSocialMediaPackageModel';
import fs from 'fs';
import path from 'path';

async function exportGrowPackageData() {
  try {
    console.log('🔌 Connecting to database...');
    const mongoUri =
      process.env.DATABASE_URL ||
      process.env.MONGO_URI ||
      'mongodb://localhost:27017/srk';
    await mongoose.connect(
      'mongodb+srv://admin:nimda@srkcluster.3yhcm.mongodb.net/grow?retryWrites=true&w=majority&appName=srkCluster'
    );
    console.log('✅ Connected to database', mongoUri);

    console.log('📦 Fetching all grow packages with IDs...');
    const packages = await growSocialMediaPackageModel.find({}).lean();

    console.log('📋 Fetching all package types with IDs...');
    const packageTypes = await growSocialMediaPackageTypeModel.find({}).lean();

    console.log('📝 Fetching all package subtypes with IDs...');
    const packageSubTypes = await growSocialMediaPackageSubTypeModel
      .find({})
      .lean();

    // Convert data to preserve _id fields and relationships
    const exportData = {
      exportDate: new Date().toISOString(),
      totalRecords: {
        packages: packages.length,
        packageTypes: packageTypes.length,
        packageSubTypes: packageSubTypes.length,
      },
      data: {
        packages: packages.map((pkg) => ({
          _id: pkg._id.toString(),
          name: pkg.name,
          description: pkg.description,
          socialMediaPlatforms: pkg.socialMediaPlatforms,
          amount: pkg.amount,
          createdAt: pkg.createdAt,
          updatedAt: pkg.updatedAt,
          __v: pkg.__v,
        })),
        packageTypes: packageTypes.map((type) => ({
          _id: type._id.toString(),
          growSocialMediaPackageId: type.growSocialMediaPackageId?.toString(),
          name: type.name,
          description: type.description,
          amount: type.amount,
          createdAt: type.createdAt,
          updatedAt: type.updatedAt,
          __v: type.__v,
        })),
        packageSubTypes: packageSubTypes.map((subType) => ({
          _id: subType._id.toString(),
          growSocialMediaPackageTypeId:
            subType.growSocialMediaPackageTypeId?.toString(),
          name: subType.name,
          description: subType.description,
          taskType: subType.taskType,
          noOfLikes: subType.noOfLikes,
          noOfVideos: subType.noOfVideos,
          noOfFollowers: subType.noOfFollowers,
          createdAt: subType.createdAt,
          updatedAt: subType.updatedAt,
          __v: subType.__v,
        })),
      },
    };

    const outputDir = path.join(__dirname, '../../exports');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = path.join(
      outputDir,
      `grow-package-data-${timestamp}.json`
    );

    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

    console.log('\n✅ Export completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Packages: ${packages.length}`);
    console.log(`   - Package Types: ${packageTypes.length}`);
    console.log(`   - Package SubTypes: ${packageSubTypes.length}`);
    console.log(`📁 File saved to: ${outputPath}`);
    console.log('\n💡 All _id fields preserved for database migration!');

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Export failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

exportGrowPackageData();
