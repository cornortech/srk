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

    let packagesImported = 0;
    let typesImported = 0;
    let subTypesImported = 0;

    // Import in order to maintain relationships
    console.log('\n📦 Importing packages...');
    if (packages && packages.length > 0) {
      for (const pkg of packages) {
        try {
          await growSocialMediaPackageModel.create({
            ...pkg,
            _id: new mongoose.Types.ObjectId(pkg._id),
            description: pkg.description || `${pkg.name} package for social media growth`,
            features: pkg.features || [],
            amountBeforeDiscount: pkg.amountBeforeDiscount || pkg.amount,
            isPopular: pkg.isPopular || false,
            growSocialMediaPackageId: pkg.growSocialMediaPackageId
              ? new mongoose.Types.ObjectId(pkg.growSocialMediaPackageId)
              : undefined,
          });
          packagesImported++;
        } catch (error: any) {
          if (error.code === 11000) {
            console.log(`  ⏭️  Skipping duplicate package: ${pkg.name}`);
          } else {
            throw error;
          }
        }
      }
      console.log(`✅ Imported ${packagesImported}/${packages.length} packages`);
    }

    console.log('\n📋 Importing package types...');
    if (packageTypes && packageTypes.length > 0) {
      for (const type of packageTypes) {
        try {
          await growSocialMediaPackageTypeModel.create({
            ...type,
            _id: new mongoose.Types.ObjectId(type._id),
            growSocialMediaPackageId: type.growSocialMediaPackageId
              ? new mongoose.Types.ObjectId(type.growSocialMediaPackageId)
              : undefined,
          });
          typesImported++;
        } catch (error: any) {
          if (error.code === 11000) {
            console.log(`  ⏭️  Skipping duplicate type: ${type.name} for package ${type.growSocialMediaPackageId}`);
          } else {
            throw error;
          }
        }
      }
      console.log(`✅ Imported ${typesImported}/${packageTypes.length} package types`);
    }

    console.log('\n📝 Importing package subtypes...');
    if (packageSubTypes && packageSubTypes.length > 0) {
      for (const subType of packageSubTypes) {
        try {
          // Find the package type to get the package ID
          const packageType = await growSocialMediaPackageTypeModel.findById(
            subType.growSocialMediaPackageTypeId
          );
          
          if (!packageType) {
            console.log(`  ⚠️  Warning: Package type not found for subtype ${subType.name}, skipping...`);
            continue;
          }

          // Determine taskType if not present
          const taskType = subType.taskType || 
                          (subType.noOfFollowers ? 'follow' : 'engagement');

          await growSocialMediaPackageSubTypeModel.create({
            ...subType,
            _id: new mongoose.Types.ObjectId(subType._id),
            growSocialMediaPackageId: packageType.growSocialMediaPackageId,
            growSocialMediaPackageTypeId: subType.growSocialMediaPackageTypeId
              ? new mongoose.Types.ObjectId(subType.growSocialMediaPackageTypeId)
              : undefined,
            taskType,
          });
          subTypesImported++;
        } catch (error: any) {
          if (error.code === 11000) {
            console.log(`  ⏭️  Skipping duplicate subtype: ${subType.name} for type ${subType.growSocialMediaPackageTypeId}`);
          } else {
            throw error;
          }
        }
      }
      console.log(`✅ Imported ${subTypesImported}/${packageSubTypes.length} package subtypes`);
    }

    console.log('\n🎉 Import completed!');
    console.log('📊 Summary:');
    console.log(`   - Packages: ${packagesImported}/${packages?.length || 0} imported`);
    console.log(`   - Package Types: ${typesImported}/${packageTypes?.length || 0} imported`);
    console.log(`   - Package SubTypes: ${subTypesImported}/${packageSubTypes?.length || 0} imported`);
    console.log('\n💡 All IDs preserved - relationships intact!');

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Import failed:', error.message);
    console.error('Stack trace:', error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
}

importGrowPackageData();
