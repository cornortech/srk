// import * as dotenv from "dotenv";
// dotenv.config();
// import * as fs from 'fs';
// import * as path from 'path';
// import connectToDatabase from "../../config/database";
// import { PackageModel } from "../../model/packageModel";
// import { PackageCommissionModel } from "../../model/packageCommissionModel";

// const exportData = async () => {
//   try {
//     console.log("🚀 Starting data export...");

//     const packages = await PackageModel.find({});
//     const commissions = await PackageCommissionModel.find({});

//     const data = {
//       packages,
//       commissions
//     };

//     const filePath = path.join(__dirname, '../seeds/packageAndCommissions.json');
    
//     // Ensure directory exists
//     const dir = path.dirname(filePath);
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
//     console.log(`✅ Data exported to ${filePath}`);
//     console.log(`Total Packages: ${packages.length}`);
//     console.log(`Total Commissions: ${commissions.length}`);

//   } catch (error) {
//     console.error("❌ Error exporting data:", error);
//     throw error;
//   }
// };

// const main = async () => {
//   try {
//     await connectToDatabase();
//     await exportData();
//     console.log("✅ Database connection closed. Exiting...");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Error in main script:", error);
//     process.exit(1);
//   }
// };

// main();
