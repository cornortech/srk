// import * as dotenv from "dotenv";
// dotenv.config();
// import * as fs from 'fs';
// import * as path from 'path';
// import connectToDatabase from "../../config/database";
// import { PackageModel } from "../../model/packageModel";
// import { PackageCommissionModel } from "../../model/packageCommissionModel";

// const importData = async () => {
//   try {
//     console.log("🚀 Starting data import...");
    
//     const filePath = path.join(__dirname, 'packageAndCommissions.json');
//     if (!fs.existsSync(filePath)) {
//       throw new Error(`File not found: ${filePath}`);
//     }

//     const fileContent = fs.readFileSync(filePath, 'utf-8');
//     const data = JSON.parse(fileContent);

//     const { packages, commissions } = data;

//     if (packages && packages.length > 0) {
//       console.log('🗑️ Clearing existing packages...');
//       await PackageModel.deleteMany({});
      
//       console.log(`Processing ${packages.length} packages...`);
//       const packageOps = packages.map((pkg: any) => ({
//         insertOne: {
//           document: pkg
//         }
//       }));
//       await PackageModel.bulkWrite(packageOps);
//     }

//     if (commissions && commissions.length > 0) {
//       console.log('🗑️ Clearing existing commissions...');
//       await PackageCommissionModel.deleteMany({});

//       console.log(`Processing ${commissions.length} commissions...`);
//       const commissionOps = commissions.map((comm: any) => ({
//         insertOne: {
//           document: comm
//         }
//       }));
//       await PackageCommissionModel.bulkWrite(commissionOps);
//     }

//     console.log("✅ Data imported successfully!");

//   } catch (error) {
//     console.error("❌ Error importing data:", error);
//     throw error;
//   }
// };

// const main = async () => {
//   try {
//     await connectToDatabase();
//     await importData();
//     console.log("✅ Database connection closed. Exiting...");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Error in seed script:", error);
//     process.exit(1);
//   }
// };

// main();
