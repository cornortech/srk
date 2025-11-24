import * as dotenv from "dotenv";
dotenv.config();
import connectToDatabase from "../../config/database";
import { EarningStatementModel } from "../../model/earningStatementModel";

async function createBalanceField() {
  console.log("🚀 Starting balance field creation...");

  const batchSize = 100;
  let lastId: any = null;
  let processed = 0;

  try {
    const totalCount = await EarningStatementModel.countDocuments({});
    console.log(`📄 Total documents to update: ${totalCount}`);

    while (true) {
      // Pagination filter by _id for better performance
      const filter = lastId ? { _id: { $gt: lastId } } : {};

      const statements = await EarningStatementModel.find(filter)
        .sort({ _id: 1 })
        .limit(batchSize)
        .select("_id earning eventWallet");

      if (statements.length === 0) break; // No more documents to process

      // Prepare bulk operations
      const bulkOps = statements.map((statement) => ({
        updateOne: {
          filter: { _id: statement._id },
          update: {
            $set: {
              balanceWallet: +(
                statement.earning - statement.eventWallet
              ).toFixed(2),
            },
          },
        },
      }));

      // Perform bulk update
      await EarningStatementModel.bulkWrite(bulkOps);

      processed += statements.length;
      lastId = statements[statements.length - 1]._id;

      const progress = ((processed / totalCount) * 100).toFixed(2);
      console.log(
        `✅ Updated ${processed}/${totalCount} documents (${progress}%)`
      );
    }

    console.log("🎉 All documents updated successfully!");
  } catch (error) {
    console.error("❌ Error in createBalanceField script:", error);
    throw error;
  }
}

const main = async () => {
  try {
    await connectToDatabase();
    await createBalanceField();
    console.log("✅ Database connection closed. Exiting...");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error in createBalanceField main script:", error);
    process.exit(1);
  }
};

main();
