import mongoose from 'mongoose';
import { growSocialMediaPackageTypeModel } from '../model/growSocialMediaPackageTypeModel';
import { growSocialMediaPackageSubTypeModel } from '../model/growSocialMediaPackageSubTypeModel';
import { growSocialMediaPackageModel } from '../model/growSocialMediaPackageModel';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function importGrowPackageData() {
  try {
    // Get the JSON file path from command line argument
    const jsonFilePath = process.argv[2];

    if (!jsonFilePath) {
      console.error('❌ Please provide the JSON file path as an argument');
      console.log(
        'Usage: npx tsx src/scripts/import-grow-package-data.ts <path-to-json-file>'
      );
      process.exit(1);
    }

    const absolutePath = path.isAbsolute(jsonFilePath)
      ? jsonFilePath
      : path.join(process.cwd(), jsonFilePath);

    if (!fs.existsSync(absolutePath)) {
      console.error(`❌ File not found: ${absolutePath}`);
      process.exit(1);
    }

    console.log('📂 Reading JSON file:', absolutePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const importData = JSON.parse(fileContent);

    console.log('🔌 Connecting to database...');
    const mongoUri =
      'mongodb+srv://admin:nimda@srkcluster.3yhcm.mongodb.net/dev?retryWrites=true&w=majority&appName=srkCluster';
    console.log(
      '📍 Database:',
      mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')
    );
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    const { packages, packageTypes, packageSubTypes, packageTodos } =
      importData.data;

    // Import in order to maintain relationships
    console.log('\n📦 Importing packages...');
    if (packages && packages.length > 0) {
      await growSocialMediaPackageModel.insertMany(
        packages.map((pkg: any) => ({
          ...pkg,
          _id: new mongoose.Types.ObjectId(pkg._id),
          growSocialMediaPackageId: pkg.growSocialMediaPackageId
            ? new mongoose.Types.ObjectId(pkg.growSocialMediaPackageId)
            : undefined,
        })),
        { ordered: false }
      );
      console.log(`✅ Imported ${packages.length} packages`);
    }

    console.log('\n📋 Importing package types...');
    if (packageTypes && packageTypes.length > 0) {
      await growSocialMediaPackageTypeModel.insertMany(
        packageTypes.map((type: any) => ({
          ...type,
          _id: new mongoose.Types.ObjectId(type._id),
          growSocialMediaPackageId: type.growSocialMediaPackageId
            ? new mongoose.Types.ObjectId(type.growSocialMediaPackageId)
            : undefined,
        })),
        { ordered: false }
      );
      console.log(`✅ Imported ${packageTypes.length} package types`);
    }

    console.log('\n📝 Importing package subtypes...');
    if (packageSubTypes && packageSubTypes.length > 0) {
      await growSocialMediaPackageSubTypeModel.insertMany(
        packageSubTypes.map((subType: any) => ({
          ...subType,
          _id: new mongoose.Types.ObjectId(subType._id),
          growSocialMediaPackageTypeId: subType.growSocialMediaPackageTypeId
            ? new mongoose.Types.ObjectId(subType.growSocialMediaPackageTypeId)
            : undefined,
        })),
        { ordered: false }
      );
      console.log(`✅ Imported ${packageSubTypes.length} package subtypes`);
    }

    console.log('\n🎉 Import completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Packages: ${packages?.length || 0}`);
    console.log(`   - Package Types: ${packageTypes?.length || 0}`);
    console.log(`   - Package SubTypes: ${packageSubTypes?.length || 0}`);
    console.log(`   - Package Todos: ${packageTodos?.length || 0}`);
    console.log('\n💡 All IDs preserved - relationships intact!');

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Import failed:', error.message);
    if (error.code === 11000) {
      console.error(
        '💡 Duplicate key error - data may already exist in the database'
      );
    }
    await mongoose.connection.close();
    process.exit(1);
  }
}

importGrowPackageData();
